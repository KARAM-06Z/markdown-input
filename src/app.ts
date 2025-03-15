import { createApp } from "vue"
import "./app.scss"
import App from "./App.vue"
import { fakeLink } from "./directives/fake-link"

const app = createApp(App)
app.mount("#app")
app.directive("fake-link", fakeLink)
