import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import { fakeLink } from "./directives/fake-link"

const app = createApp(App)
app.mount("#app")
app.directive("fake-link", fakeLink)
