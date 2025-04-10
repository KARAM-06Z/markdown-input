export {}

declare global {
  interface Array<T> {
    get first(): T | undefined
    get last(): T | undefined
  }
}

Object.defineProperty(Array.prototype, "first", {
  get: function () {
    return this[0]
  },
})

Object.defineProperty(Array.prototype, "last", {
  get: function () {
    return this[this.length - 1]
  },
})
