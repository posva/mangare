<template>
  <div class="search-container" :class="searchContainerClass">
    <input autocomplete="off" id="search-input" v-model="value" debounce="100"
      name="query" type="text" @change="$emit($event)"
      @focus="searchFocused = true"
      @blur="searchFocused = false"
    >
    <label for="search-input">
      <span>Search</span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
      twoWay: true
    }
  },
  data () {
    return {
      searchFocused: false
    }
  },
  computed: {
    searchContainerClass () {
      return {
        filled: this.value || this.searchFocused
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'
@import '../assets/style/flex'

.search-container
  @extend .flex
  margin 1rem 2rem
  position relative
  overflow hidden
  user-select none
  font-smoothing antialised
  font-size 2rem
  @media (max-width 700px)
    font-size 1.5rem
  background-color darken(clear, 20%)
  border-radius 2rem

  &.filled
    label::before
      transform scale3d(120, 120, 1)

    &::after
      transform translate3d(-100%, 0, 0)

  &::after
    content ''
    position absolute
    width 100%
    height 2px
    background @background-color
    bottom 0
    transform translate3d(-200%, 0, 0)
    transition transform 0.3s

  label
    position absolute
    padding 0 2.5rem
    left 2rem
    top 0.1rem
    @media (max-width 700px)
      top 0.5rem
    width 100%
    text-align left
    pointer-events none
    color clear

    &::before
      content ''
      position absolute
      left 0
      top 0.3rem
      @media (max-width 700px)
        top 0
      width 2rem
      height @width
      background url(../assets/img/search.svg) no-repeat center center
      background-size 100%
      transition transform 0.3s cubic-bezier(0.7,0,0.3,1)

  input
    width 100%
    height 3rem
    font-weight 100
    border none
    outline none
    padding .5rem
    padding-left 2rem
    background-color transparent
    z-index 2
</style>
