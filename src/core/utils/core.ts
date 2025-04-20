type TMap<T = any> = { [key: string]: T }
type TOptionalMap<T = any> = { [key: string]: T | undefined }
type TOptionalProp<T = any> = T | undefined
type TNullableProp<T = any> = T | null
type TClass = { new (...args: any[]): any }

const NOOP = () => {}

const RandGuid = () => "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace("x", () => ((Math.random() * 9) | 0).toString())

export { NOOP, RandGuid }
export type { TMap, TOptionalMap, TOptionalProp, TNullableProp, TClass }
