type TMap<T = any> = { [key: string]: T }
type TOptionalProp<T = any> = T | undefined
type TOptionalMap<T = any> = { [key: string]: T | undefined }

const NOOP = () => {}

const RandGuid = () => "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace("x", () => ((Math.random() * 9) | 0).toString())

export { NOOP, RandGuid }
export type { TMap, TOptionalMap, TOptionalProp }
