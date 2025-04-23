import { fakeLink } from "../directives/fake-link"
import { createApp, type App } from "vue"
import { Singleton } from "../utils/singleton"
import { DropdownAlignmentEnum } from "../../components/dropdown/meta"
import { SizeEnum, type TOptionalProp } from "../utils/core"
import type { ICoreService } from "../interfaces/i-core-service"

@Singleton
class CoreService implements ICoreService {
  private _overlay!: TOptionalProp<HTMLElement>
  dropdownShown!: boolean

  constructor(application: App) {
    this._init(application)
    this._overlay = document.getElementById("app-overlay") as HTMLElement
    this.dropdownShown = false
  }

  private _mountApp(application: App): App<Element> {
    const app = createApp(application)
    app.mount("#app")
    return app
  }

  private _initDirectives(app: App): void {
    app.directive("fake-link", fakeLink)
  }

  private _init(application: App): void {
    const app = this._mountApp(application)
    this._initDirectives(app)
  }

  showDropdown(e: HTMLElement, alignment: DropdownAlignmentEnum = DropdownAlignmentEnum.Center, size: SizeEnum = SizeEnum.MD): void {
    if (!this?._overlay) return
    this._overlay.classList.add("show")
    const dropdown = this._overlay.children[1]
    const clientRect = e.getBoundingClientRect()
    const xAxis =
      alignment === DropdownAlignmentEnum.Center
        ? `left: ${clientRect.left + clientRect.width / 2}px`
        : alignment === DropdownAlignmentEnum.Left
        ? `left: ${clientRect.left}px`
        : `right: ${window.innerWidth - clientRect.right}px`
    dropdown.setAttribute("style", `top: ${clientRect.top + clientRect.height + 6}px; ${xAxis}`)
    dropdown.classList.add("dropdown", `dropdown-${size}`, `align-${alignment}`)
    this.dropdownShown = true
  }

  hideDropdown(): void {
    if (!this?._overlay) return
    this._overlay.classList.remove("show")
    const dropdown = this._overlay.children[1]
    dropdown.removeAttribute("style")
    dropdown.className = ""
    this.dropdownShown = false
  }
}

export { CoreService }
