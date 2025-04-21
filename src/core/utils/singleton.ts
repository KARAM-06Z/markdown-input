import type { TClass } from "./core"

function Singleton<T extends TClass>(ctr: T): T {
  let instance: T

  return class {
    constructor(...args: any[]) {
      if (instance) return instance
      instance = new ctr(...args)
      return instance
    }
  } as T
}
export { Singleton }
