import { reactive, type Reactive } from "vue"
import type { TMap, TNullableProp } from "./core/utils/core"

const services = reactive({
  coreService: null,
}) as Reactive<TMap<TNullableProp<Object>>>

const serviceMap = {
  "core-service": "core-service",
}

type TServicesKeys = keyof typeof serviceMap

const registerService = (name: TServicesKeys, service: Object) => (services[name] = service)
const getService = (name: TServicesKeys): TNullableProp<Object> => services[name]

export { serviceMap, registerService, getService }
