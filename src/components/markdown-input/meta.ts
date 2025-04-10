import type { TOptionalProp } from "../../core/core"

enum MarkdownInputActiveTab {
  Write,
  Preview,
}

enum MarkdownInputDropdownModeEnum {
  Mention = 1,
  Tag,
}

type TMarkdownMark = "link" | "custom-link" | "header" | "bold" | "italic" | "underline" | "ol" | "ul"
type TSelection = { start: number; end: number }
type TFindFirstWhitespaceIdx = { text: string; idx?: number; reverse?: TOptionalProp<boolean>; byLine?: TOptionalProp<boolean> }
type TMarkdownInputDropdown = {
  model: boolean
  mode: TOptionalProp<MarkdownInputDropdownModeEnum>
  query: TOptionalProp<string>
}
type TMarkdownMarkSelectionData = {
  paragraphDivision: { preTagText: string; tagText: string; postTagText: string }
  selectionMatch: RegExpMatchArray | null
  selectionTrim: string
  preWhiteSpace: string
  postWhiteSpace: string
}
type TCustomLink = {
  mode: MarkdownInputDropdownModeEnum
  text: string
  stringifiedData: string
}
type TCustomLinkArgs = { el: Element; data: any }
type TModeAction = { mention?: (args: TCustomLinkArgs) => void; tag?: (args: TCustomLinkArgs) => void }
// type TMarkdownDropdownProps = Omit<TDropdownProps, "modelValue" | "resolveTrigger" | "teleport">
// type TMarkdownCustomKeyMapper = TKeyMapper & { stringify?: string[] }
// type TCustomMarkdownDropdownProps = TMarkdownDropdownProps & {
//   mention: {
//     promise: (filter: any) => Promise<any>
//     keyMapper?: TMarkdownCustomKeyMapper
//     initialOffset?: number
//     click?: (args: TCustomLinkArgs) => void
//   }
//   tag: {
//     promise: (filter: any) => Promise<any>
//     keyMapper?: TMarkdownCustomKeyMapper
//     initialOffset?: number
//     click?: (args: TCustomLinkArgs) => void
//   }
// }

export { MarkdownInputDropdownModeEnum, MarkdownInputActiveTab }
export type {
  TMarkdownMark,
  TSelection,
  TFindFirstWhitespaceIdx,
  TMarkdownInputDropdown,
  TCustomLink,
  // TCustomMarkdownDropdownProps,
  // TMarkdownCustomKeyMapper,
  TMarkdownMarkSelectionData,
  TCustomLinkArgs,
  TModeAction,
}
