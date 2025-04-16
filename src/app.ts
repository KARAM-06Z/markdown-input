import "./app.scss"
import "../prototypes"
import App from "./App.vue"
import { createApp } from "vue"
import { fakeLink } from "./directives/fake-link"

const app = createApp(App)
app.mount("#app")
app.directive("fake-link", fakeLink)
