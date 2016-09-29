<template>
  <div class="page-preview" :style="style"
       v-touch:swipeleft="nextPage"
       v-touch:swiperight="previousPage"
       v-touch:pinchend="pinch"
       v-touch-options:pinchend="{ threshold: 100 }"
       @click="handleClick"
       v-el:container
  >
    <img @click="nextPage"
         title="Next Page"
         :style="imageStyle"
         :src="currentPageImage">
  </div>
</template>

<script>
const ESC_KEY = 27
const LEFT_KEY = 37
/* const UP_KEY = 38 */
const RIGHT_KEY = 39
/* const DOWN_KEY = 39 */

const MIN_SCALE = 0.375

export default {
  props: {
    pages: Array
  },
  computed: {
    style () {
      return {
        visibility: this.display ? 'initial' : 'hidden',
        opacity: this.scaling
                 ? 1 - Math.min(1, MIN_SCALE / this.scale)
                 : 1
      }
    },
    imageStyle () {
      return {
        transform: `scale(${this.scale})`
      }
    },
    currentPageImage () {
      this.currentPage
      return this.pages && this.pages[this.currentPage] || ''
    }
  },
  data () {
    return {
      display: false,
      currentPage: 0,
      scaling: false,
      scale: 1
    }
  },
  methods: {
    pinch (event) {
      if (event.scale < MIN_SCALE) this.display = false
      this.scaling = false
      this.scale = 1
    },
    pinchmove (event) {
      this.scaling = true
      this.scale = Math.min(1, event.scale)
    },
    handleClick (event) {
      if (event.target === this.$els.container) {
        this.display = false
      }
    },
    nextPage () {
      this.currentPage = Math.min(this.currentPage + 1, this.pages.length - 1)
    },
    previousPage () {
      this.currentPage = Math.max(this.currentPage - 1, 0)
    },
    handleKey (event) {
      switch (event.keyCode) {
        case LEFT_KEY:
          this.previousPage()
          break
        case RIGHT_KEY:
          this.nextPage()
          break
        case ESC_KEY:
          this.display = false
          break
        default:
          break
      }
    }
  },
  ready () {
    document.addEventListener('keyup', this.handleKey.bind(this))
    this.$el.hammer.get('pinch').set({ enable: true })
    this.$el.hammer.on('pinchmove', (event) => this.pinchmove(event))
  },
  destroyed () {
    document.removeEventListener('keyup', this.handleKey)
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'

.page-preview {
  position fixed
  display flex
  z-index 99999999
  overflow hidden
  width 100%
  height 100%
  top 0
  left 0
  padding 0
  margin 0
  transition opacity .3s
  background-color clear

  &:hover {
    cursor zoom-out
  }

  img {
    max-height 100%
    max-width @max-height
    margin auto

    &:hover {
      cursor pointer
    }
  }
}
</style>
