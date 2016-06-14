const styleProps = ['display', 'visibility', 'position']

export const heightToggle = {
  beforeEnter: function (el) {
    let cache = {}
    let inserted = false
    // cache current styling
    styleProps.forEach((style) => {
      cache[style] = el.style[style]
    })

    // hide the element and position in absolute so we can
    // compute its height and set it. This is needed for
    // css transitions
    el.style.visibility = 'hidden'
    // may be needed in some occasions
    // el.style.position = 'absolute'
    el.style.display = 'block'
    if (!document.contains(el)) {
      document.body.appendChild(el)
      inserted = true
    }
    const style = window.getComputedStyle(el)
    el.style.height = style.height

    // When using the ipad and changing orientation to horizontal
    // The height must be reset
    this.resizeCallback = () => {
      el.style.height = ''
      const style = window.getComputedStyle(el)
      el.style.height = style.height
    }
    el.resizeCallback = this.resizeCallback

    if (inserted) document.body.removeChild(el)

    // restore styling
    styleProps.forEach(function (style) {
      el.style[style] = cache[style]
    })
  },
  afterLeave: function (el) {
    // reset the style height when leaving
    el.style.height = ''
    // shutdown event resize
  }
}
