import "./app.scss"
import "../prototypes"
import App from "./App.vue"
import { CoreService } from "./core/models/core-service"
import { registerService } from "./services"

registerService("core-service", new CoreService(App as any))
