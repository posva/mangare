<template>
  <div class="page-preview" :style="style"
       v-touch:swipeleft="nextPage"
       v-touch:swiperight="previousPage"
       @click="handleClick"
       v-el:container
  >
    <img @click="nextPage"
         title="Next Page"
        :src="currentPageImage">
  </div>
</template>

<script>
const ESC_KEY = 27
const LEFT_KEY = 37
/* const UP_KEY = 38*/
const RIGHT_KEY = 39
/* const DOWN_KEY = 39*/

export default {
  props: {
    pages: Array
  },
  computed: {
    style () {
      return {
        visibility: this.display ? 'initial' : 'hidden'
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
      currentPage: 0
    }
  },
  methods: {
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
