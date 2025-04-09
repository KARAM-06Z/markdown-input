import {
  MarkdownInputDropdownModeEnum,
  type TCustomLink,
  type TFindFirstWhitespaceIdx,
  type TMarkdownMark,
  type TMarkdownMarkSelectionData,
  type TModeAction,
  type TSelection,
} from "./meta"

const props = {
  label: String,
  placeholder: String,
  required: Boolean,
}

const MARKDOWN_SYMBOLS = {
  header: "#",
  bold: "**",
  italic: "//",
  underline: "__",
} as THashMap<string>

const MARKDOWN_SEARCH_SYMBOLS = {
  header: "#",
  bold: "*",
  italic: "/",
  underline: "_",
  anchorOpen: "[",
  anchorClose: "]",
} as THashMap<string>

const MARKDOWN_SYMBOLS_TAG = {
  "*": "strong",
  "/": "em",
  _: "ins",
} as THashMap<string>

const regexMap = {
  paragraphNewLineSplit: /(?<=\n)\s*\n/gm,
  paragraphDivision: /^(\s*)(.*[^\s])(\s*)$/,
  anchorMarkMatch: /^\[(.+)\]\((.+)\)$/,
  headerMarkMatch: /^(#+)(-?) (.+)$/,
  boldMarkMatch: /^(\*{2})(.*)(\*{2})$/,
  italicMarkMatch: /^(\/{2})(.*)(\/{2})$/,
  underlineMarkMatch: /^(_{2})(.*)(_{2})$/,
  anchorTagReplace: /^\[([@|#]?)(.+)\]\((.+)\)(.*)$/,
  headerTagReplace: /^#{1,6}-? $/,
}

const sharedInputProperties = [
  "boxSizing",
  "width", // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  "height",
  "overflowX",
  "overflowY", // copy the scrollbar for IE

  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",

  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "lineHeight",
  "fontFamily",

  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration", // might not make a difference, but better be safe

  "letterSpacing",
  "wordSpacing",
]

const dropdownCloseKeys = new Set([
  "Escape",
  "Tab",
  "Enter",
  "Space",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
])
const dropdownConditionalCloseKeys = new Set(["Backspace", "Delete"])
const inputIgnoreKeys = new Set([
  "Shift",
  "Alt",
  "Control",
  "Meta",
  "CapsLock",
  "NumLock",
  "ScrollLock",
  "Pause",
  "Insert",
  "PrintScreen",
  "ContextMenu",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
])

const createMirrorDiv = (name: string, wrapper: any) => {
  const el = document.createElement("div")
  el.id = name
  wrapper?.appendChild(el)
  return el
}

const getInputCaretPosition = (e: any) => {
  if (e.nodeName != "TEXTAREA") return

  const position = e.selectionEnd
  const tagName = e.nodeName + "--mirror-div"
  const inputWrapper = document.getElementById("input-wrapper")
  if (!inputWrapper) return

  const mirrorDivElement = document.getElementById(tagName)
  const mirrorDiv = mirrorDivElement ? mirrorDivElement : createMirrorDiv(tagName, inputWrapper)
  if (!mirrorDiv) return

  const isFirefox = !((window as THashMap)?.["mozInnerScreenX"] == null)
  const style = mirrorDiv.style as THashMap
  const computedStyle = getComputedStyle(e) as THashMap
  style.whiteSpace = "pre-wrap"
  style.position = "absolute"
  style.visibility = "hidden"
  if (isFirefox) {
    style.width = parseInt(computedStyle.width) - 2 + "px" // Firefox adds 2 pixels to the padding - https://bugzilla.mozilla.org/show_bug.cgi?id=753662
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (e.scrollHeight > parseInt(computedStyle.height)) style.overflowY = "scroll"
  } else style.overflow = "hidden" // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  style.top = e.offsetTop + parseInt(computedStyle.borderTopWidth) + "px"
  sharedInputProperties.forEach((prop) => (style[prop] = computedStyle[prop]))

  mirrorDiv.textContent = e.value.substring(0, position)

  const span = document.createElement("span")
  span.textContent = e.value.substring(position) || "." // || because a completely empty faux span doesn't render at all
  mirrorDiv.appendChild(span)

  return {
    y: span.offsetTop + parseInt(computedStyle["borderTopWidth"]) - e.scrollTop,
    x: span.offsetLeft + parseInt(computedStyle["borderLeftWidth"]),
  }
}

const getTagSurroundingText = (paragraph: string, tagStartIdx: number, tagEndIdx: number) => ({
  preTagText: paragraph.slice(0, tagStartIdx),
  tagText: paragraph.slice(tagStartIdx, tagEndIdx),
  postTagText: paragraph.slice(tagEndIdx),
})

const findFirstWhitespaceIdx = ({ text, idx = 0, byLine, reverse }: TFindFirstWhitespaceIdx) => {
  let whitespaceIdx = -1
  if (text?.[idx]?.match(/\s/) && text?.[idx - 1]?.match(/\S/)) idx--
  while (idx >= 0 && idx <= text.length) {
    text[idx]?.match(byLine ? /\n/ : /\s/) && (whitespaceIdx = idx)
    if (whitespaceIdx > -1) break
    idx = idx + (reverse ? -1 : 1)
  }
  return whitespaceIdx == -1 ? (reverse ? 0 : text.length) : whitespaceIdx
}

const getHighlightedTextIdx = ({ selectionStart, selectionEnd, value }: HTMLInputElement, byLine = false): TSelection => {
  if (selectionStart != selectionEnd) return { start: selectionStart!, end: selectionEnd! }
  return {
    start: findFirstWhitespaceIdx({ text: value, idx: selectionStart!, reverse: true, byLine }),
    end: findFirstWhitespaceIdx({ text: value, idx: selectionStart!, byLine }),
  }
}

const updateHighlightedText = (
  text: string,
  type: TMarkdownMark,
  selection: TSelection,
  customLink?: TCustomLink
): { text: string; selection: { start: number; end: number } } => {
  const paragraphDivision = getTagSurroundingText(text, selection.start, selection.end)
  const selectionMatch = paragraphDivision.tagText.match(regexMap.paragraphDivision)
  const selectionTrim = selectionMatch?.[2] || paragraphDivision.tagText
  const preWhiteSpace = selectionMatch?.[1] || ""
  const postWhiteSpace = selectionMatch?.[3] || ""

  switch (type) {
    case "link":
    case "custom-link":
      return anchorMark({ paragraphDivision, selectionMatch, selectionTrim, preWhiteSpace, postWhiteSpace }, customLink)
    case "header":
      return headerMark({ paragraphDivision, selectionMatch, selectionTrim, preWhiteSpace, postWhiteSpace })
    default:
      return simpleMark({ paragraphDivision, selectionMatch, selectionTrim, preWhiteSpace, postWhiteSpace }, type)
  }
}

const anchorMark = (selectionData: TMarkdownMarkSelectionData, customLink?: TCustomLink) => {
  const anchorMatch = selectionData.selectionTrim.match(regexMap.anchorMarkMatch)
  if (anchorMatch)
    selectionData.paragraphDivision.tagText = `${selectionData.preWhiteSpace}${anchorMatch?.[1]}${selectionData.postWhiteSpace}`
  else {
    const data = customLink?.stringifiedData || "URL"
    const text = customLink?.text || selectionData.selectionTrim || "Text"
    const customLinkSymbol = customLink?.mode ? (customLink.mode == MarkdownInputDropdownModeEnum.Mention ? "@" : "#") : ""
    selectionData.paragraphDivision.tagText = `${selectionData.preWhiteSpace}[${customLinkSymbol}${text}](${data})${selectionData.postWhiteSpace}`
  }
  return {
    text: `${selectionData.paragraphDivision.preTagText}${selectionData.paragraphDivision.tagText}${selectionData.paragraphDivision.postTagText}`,
    selection: { start: 5, end: 10 },
  }
}

const headerMark = (selectionData: TMarkdownMarkSelectionData) => {
  const headerMatch = selectionData.selectionTrim.match(regexMap.headerMarkMatch)
  if (headerMatch) {
    const hashes = headerMatch[1].length == 6 ? "" : headerMatch[1].concat(MARKDOWN_SYMBOLS["header"])
    selectionData.paragraphDivision.tagText = `${selectionData.preWhiteSpace}${hashes ? `${hashes}${headerMatch?.[2] ? "-" : ""} ` : ""}${
      headerMatch[3]
    }${selectionData.postWhiteSpace}`
  } else
    selectionData.paragraphDivision.tagText = `${selectionData.preWhiteSpace}${MARKDOWN_SYMBOLS["header"]} ${selectionData.selectionTrim}${selectionData.postWhiteSpace}`

  return {
    text: `${selectionData.paragraphDivision.preTagText}${selectionData.paragraphDivision.tagText}${selectionData.paragraphDivision.postTagText}`,
    selection: { start: 5, end: 10 },
  }
}

const simpleMark = (selectionData: TMarkdownMarkSelectionData, type: TMarkdownMark) => {
  const tagMatch = selectionData.selectionTrim.match((regexMap as THashMap)[`${type}MarkMatch`])
  if (!!tagMatch) selectionData.paragraphDivision.tagText = `${selectionData.preWhiteSpace}${tagMatch?.[2]}${selectionData.postWhiteSpace}`
  else
    selectionData.paragraphDivision.tagText = `${selectionData.preWhiteSpace}${MARKDOWN_SYMBOLS[type]}${selectionData.selectionTrim}${MARKDOWN_SYMBOLS[type]}${selectionData.postWhiteSpace}`

  const preParagraphTextLength = selectionData.paragraphDivision.preTagText.length
  return {
    text: `${selectionData.paragraphDivision.preTagText}${selectionData.paragraphDivision.tagText}${selectionData.paragraphDivision.postTagText}`,
    selection: {
      start: preParagraphTextLength + (tagMatch ? 0 : 2),
      end: preParagraphTextLength + selectionData.paragraphDivision.tagText.length - (tagMatch ? 0 : 2),
    },
  }
}

const clickAction = (el: Element, clickActions?: TModeAction) => {
  try {
    const data = JSON.parse(el?.getAttribute("data")!)
    ;(clickActions as THashMap)[(MarkdownInputDropdownModeEnum as THashMap)[el.getAttribute("type") as string].toLowerCase()]({ el, data })
  } catch (e) {
    NOOP()
  }
}

const prepareCustomLinksEvents = async (clickActions?: TModeAction) => {
  if (!clickActions) return
  await nextTick()
  document.querySelectorAll(".markdown-custom-link").forEach((el: Element) => {
    el.removeEventListener("click", () => clickAction(el, clickActions))
    el.addEventListener("click", () => clickAction(el, clickActions))
  })
}

const constructCustomLink = (anchorMatch: RegExpMatchArray) =>
  `<a  type='${
    anchorMatch[1] == "@" ? MarkdownInputDropdownModeEnum.Mention : MarkdownInputDropdownModeEnum.Tag
  }'  class='markdown-custom-link' id='markdown-custom-link-${uid()}' data='${anchorMatch[3]}' href='javascript:void(0)'>${anchorMatch[1]}${
    anchorMatch[2]
  }</a>`

const useMarkdownParse = (text: string, skipHeaders = false, skipEvents = false, clickActions?: TModeAction): TOptional<string> => {
  if (!text) return
  const paragraphs = text.split(regexMap.paragraphNewLineSplit)
  if (paragraphs.length > 1) {
    prepareCustomLinksEvents(clickActions)
    return paragraphs.reduce((p, c) => p.concat("\n").concat(useMarkdownParse(c, false, true)!), "")
  }
  let paragraph = paragraphs.first!
  let pointer = 0
  const startTagsIdxs = {} as { [symbol: string]: number }
  const startTagStack = [] as string[]

  const popLastTag = () => {
    const lastTag = startTagStack.last!
    startTagStack.pop()
    delete startTagsIdxs[lastTag]
  }

  const clearTags = (stopSymbol: string) => {
    let stackClean = false
    while (!stackClean) {
      if (stopSymbol != startTagStack.last) popLastTag()
      else {
        popLastTag()
        stackClean = true
      }
    }
  }

  const simpleTagReplace = (symbol: string) => {
    if (paragraph[pointer - 1] !== symbol) {
      pointer++
      return
    }
    if (startTagsIdxs[symbol] === undefined) {
      startTagsIdxs[symbol] = pointer
      startTagStack.push(symbol)
      pointer++
    } else {
      const paragraphDivision = getTagSurroundingText(
        paragraph,
        !!startTagsIdxs[symbol] ? startTagsIdxs[symbol] - 1 : startTagsIdxs[symbol],
        pointer + 1
      )
      const tagInnerText = paragraphDivision.tagText.slice(2, paragraphDivision.tagText.length - 2)
      const tagInnerTextTrim = tagInnerText.trim()
      if (!tagInnerTextTrim || tagInnerTextTrim.length < tagInnerText.length) {
        !tagInnerTextTrim && (pointer += tagInnerText.length + 2)
        clearTags(symbol)
        return
      }
      const tag = `<${MARKDOWN_SYMBOLS_TAG[symbol]}>${tagInnerTextTrim}</${MARKDOWN_SYMBOLS_TAG[symbol]}>`
      paragraph = paragraphDivision.preTagText.concat(tag).concat(paragraphDivision.postTagText)
      pointer = paragraphDivision.preTagText.length + tag.length
      clearTags(symbol)
    }
  }

  const headerTagReplace = () => {
    if (paragraph[pointer - 1] !== "\n" && paragraph[pointer - 1] !== "" && paragraph[pointer - 1] !== undefined) {
      pointer++
      return
    }
    const afterTagFirstWhitespaceIdx = findFirstWhitespaceIdx({ text: paragraph.slice(pointer) })
    const tagMatchString = paragraph.slice(pointer, pointer + afterTagFirstWhitespaceIdx + 1)
    const tagRegex = new RegExp(regexMap.headerTagReplace)
    if (!tagRegex.test(tagMatchString)) {
      pointer++
      return
    }
    const headerTextFirstWhitespaceIdx = findFirstWhitespaceIdx({
      text: paragraph.slice(pointer + afterTagFirstWhitespaceIdx + 1),
      byLine: true,
    })
    const headerText = paragraph
      .slice(pointer + afterTagFirstWhitespaceIdx + 1, pointer + afterTagFirstWhitespaceIdx + 1 + headerTextFirstWhitespaceIdx)
      .trim()
    if (!headerText) {
      pointer++
      return
    }
    const paragraphDivision = getTagSurroundingText(
      paragraph,
      pointer > 1 ? pointer - 1 : pointer,
      pointer + afterTagFirstWhitespaceIdx + 1 + headerTextFirstWhitespaceIdx
    )
    const headerIsUnderlined = tagMatchString.includes("-")
    const hashCount = headerIsUnderlined ? tagMatchString.length - 2 : tagMatchString.length - 1
    const tag = `\n<h${hashCount} class="d-inline-block w-100 ${headerIsUnderlined ? "border-bottom" : ""}">${useMarkdownParse(
      headerText,
      true,
      true
    )}</h${hashCount}>`
    paragraph = paragraphDivision.preTagText.concat(tag).concat(paragraphDivision.postTagText)
    pointer = paragraphDivision.preTagText.length + tag.length
  }

  const anchorTagReplace = () => {
    if (startTagsIdxs[MARKDOWN_SEARCH_SYMBOLS.anchorOpen] === undefined) {
      pointer++
      return
    }
    const afterTagFirstWhitespaceIdx = findFirstWhitespaceIdx({ text: paragraph, idx: pointer })
    const anchorText = paragraph.slice(startTagsIdxs[MARKDOWN_SEARCH_SYMBOLS.anchorOpen], afterTagFirstWhitespaceIdx)
    const anchorMatch = anchorText.match(regexMap.anchorTagReplace)
    if (!anchorMatch) {
      clearTags(MARKDOWN_SEARCH_SYMBOLS.anchorOpen)
      pointer++
      return
    }
    const paragraphDivision = getTagSurroundingText(
      paragraph,
      startTagsIdxs[MARKDOWN_SEARCH_SYMBOLS.anchorOpen],
      afterTagFirstWhitespaceIdx
    )
    const isCustomLink = !!anchorMatch[1]
    const tag = isCustomLink ? constructCustomLink(anchorMatch) : `<a href="${anchorMatch[3]}" target="_blank">${anchorMatch[2]}</a>`
    paragraph = paragraphDivision.preTagText.concat(tag).concat(anchorMatch?.[4]).concat(paragraphDivision.postTagText)
    pointer = paragraphDivision.preTagText.length + tag.length
    clearTags(MARKDOWN_SEARCH_SYMBOLS.anchorOpen)
  }

  while (pointer < paragraph.length)
    switch (paragraph[pointer]) {
      case MARKDOWN_SEARCH_SYMBOLS.bold: {
        simpleTagReplace(MARKDOWN_SEARCH_SYMBOLS.bold)
        continue
      }
      case MARKDOWN_SEARCH_SYMBOLS.italic: {
        simpleTagReplace(MARKDOWN_SEARCH_SYMBOLS.italic)
        continue
      }
      case MARKDOWN_SEARCH_SYMBOLS.underline: {
        simpleTagReplace(MARKDOWN_SEARCH_SYMBOLS.underline)
        continue
      }
      case MARKDOWN_SEARCH_SYMBOLS.anchorOpen: {
        if (startTagsIdxs[MARKDOWN_SEARCH_SYMBOLS.anchorOpen] === undefined) {
          startTagsIdxs[MARKDOWN_SEARCH_SYMBOLS.anchorOpen] = pointer
          startTagStack.push(MARKDOWN_SEARCH_SYMBOLS.anchorOpen)
        }
        pointer++
        continue
      }
      case MARKDOWN_SEARCH_SYMBOLS.anchorClose: {
        anchorTagReplace()
        continue
      }
      case MARKDOWN_SEARCH_SYMBOLS.header: {
        !skipHeaders ? headerTagReplace() : pointer++
        continue
      }
      // case '.': {
      // }
      default:
        pointer++
    }

  !skipEvents && prepareCustomLinksEvents(clickActions)
  return paragraph
}

export {
  props,
  dropdownCloseKeys,
  dropdownConditionalCloseKeys,
  inputIgnoreKeys,
  getInputCaretPosition,
  getHighlightedTextIdx,
  updateHighlightedText,
  useMarkdownParse,
}
type TMarkdownProps = typeof props
export type { TMarkdownProps }
