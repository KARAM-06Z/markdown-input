import { fakeLink } from "../../directives/fake-link"
import { createApp, type App } from "vue"
import { Singleton } from "../utils/singleton"
import type { ICoreService } from "../interfaces/i-core-service"

@Singleton
class CoreService implements ICoreService {
  private _overlay!: HTMLElement

  constructor(application: App) {
    const app = this.mountApp(application)
    this.initDirectives(app)
    this._overlay = document.getElementById("app-overlay") as HTMLElement
  }

  get getOverlay(): HTMLElement {
    return this._overlay
  }

  private mountApp(application: App): App<Element> {
    const app = createApp(application)
    app.mount("#app")
    return app
  }

  private initDirectives(app: App): void {
    app.directive("fake-link", fakeLink)
  }
}

export { CoreService }
