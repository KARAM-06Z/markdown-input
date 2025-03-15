const fakeLink = {
  created(el: HTMLElement) {
    el.setAttribute("href", "javascript:void(0)")
  },
}

export { fakeLink }
