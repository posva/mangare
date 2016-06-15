<template>
  <div class="page-preview" :style="style" @click="display = false">
    <img :src="currentPageImage">
  </div>
</template>

<script>
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
      return this.pages[this.currentPage] || ''
    }
  },
  data () {
    return {
      display: false,
      currentPage: 0
    }
  },
  methods () {
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

  img {
    max-height 100%
    margin auto

    &:hover {
      cursor zoom-out
    }
  }
}
</style>
