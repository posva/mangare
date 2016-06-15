<template>
  <button :disabled="isDisabled" @click="click" :class="state" :style="buttonStyle" class="progress-button" data-style="shrink" data-horizontal>
    <span class="content">
      <slot></slot>
    </span>
    <span class="progress">
      <span class="progress-inner" :class="innerClass" :style="style">
      </span>
    </span>
    <div v-show="!isDisabled" :class="moreClasses" @click="toggleMenu"
         v-clickaway="showMenu = false"
         class="progress-button__more">
      <div class="arrow-down">
      </div>
      <div class="progress-button__more__content">
        <div @click.stop="showMenu = false" class="progress-button__more__content__item">Download epub</div>
        <div class="progress-button__more__content__item">Read Online</div>
        <div class="progress-button__more__content__item">Refresh Data</div>
      </div>
    </div>
  </button>
</template>

<script>
import { directive as Clickaway } from 'vue-clickaway'
import {
  resetDownloadProgress
} from '../vuex/actions'
import {
  downloads
} from '../vuex/getters'
const animsDelay = 1300

import {timeout} from '../utils'

export default {
  vuex: {
    getters: {
      downloads
    },
    actions: {
      resetDownloadProgress
    }
  },
  directives: { Clickaway },
  props: {
    disabled: {
      type: [String, Boolean],
      default: false
    },
    id: String
  },
  computed: {
    progress () {
      return this.downloads && this.id ? (this.downloads[this.id] || 0) : 0
    },
    isDisabled () {
      this.disabled
      return this.state !== '' || this.disabled
    },
    isFinished () {
      return 1 - this.progress < 0.0001
    },
    moreClasses () {
      return {
        active: this.showMenu
      }
    },
    buttonStyle () {
      let style = {}
      if (!this.state) style.overflow = 'initial'
      return style
    },
    style () {
      return {
        width: `${100 * this.progress}%`,
        opacity: this.state === 'state-loading' ? 1 : 0
      }
    }
  },
  data () {
    return {
      state: '',
      innerClass: '',
      showMenu: false
    }
  },
  watch: {
    progress (progress) {
      // don't use transition because generation is faster
      // and transition prevents the width from actually updating
      // when there are too many updates on a css property
      if (progress >= 0.5) {
        this.innerClass = 'notransition'
      }

      if (this.isFinished) {
        this.finish()
      }
    }
  },
  ready () {
    if (this.progress > 0 && this.progress < 1) {
      console.log(this.id, 'IN READY')
      this.$nextTick(() => this.state = 'state-loading')
    }
  },
  methods: {
    click (event) {
      if (!event.$ignore) this.$emit('download', event)
    },
    toggleMenu (event) {
      event.$ignore = true
      this.showMenu = !this.showMenu
    },
    start (reset = true) {
      this.innerClass = 'notransition'
      if (reset) this.resetDownloadProgress(this.id)
      this.state = 'state-loading'
      this.$nextTick(() => this.innerClass = '')
    },
    fail () {
      this.end('state-error')
    },
    finish () {
      this.end('state-success')
    },
    end (state) {
      this.innerClass = ''
      timeout(300)
      .then(() => {
        this.state = state
        return timeout(500)
      }).then(() => {
        this.resetDownloadProgress(this.id)
        this.innerClass = 'notransition'
        return timeout(animsDelay)
      }).then(() => {
        this.innerClass = ''
        this.state = ''
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '../assets/style/palette'
@import '../assets/style/shadow'
buttonBackColor = #954170

success = darken(success, 20%)

progressBackColor = #258CD4

successColor = #1d9650
errorColor = #FF5555

.progress-button
  cursor pointer
  position relative
  display inline-block
  padding 0 calc(60px + 1rem) 0 60px
  outline none
  border none
  background primary
  color dark
  text-transform uppercase
  letter-spacing 1px
  font-size 1em
  line-height 4
  .content
    position relative
    display block
    &::before // success
      content "Enjoy!"
      color darken(success, 70%)
    &::after // error
      content "Oops!"
      color darken(error, 20%)
  .progress
    background info
  .progress-inner
    position absolute
    left 0
    background darken(info, 20%)

.progress-button[disabled],
.progress-button[disabled].state-loading
  background info
  cursor default

.progress-button .content::before,
.progress-button .content::after
  position absolute
  right 20px
  // font-family "icomoon"
  opacity 0
  transition opacity 0.3s 0.3s

.progress-button.state-success .content::before,
.progress-button.state-error .content::after
  opacity 1

.progress-button.state-success
  background success

.progress-button.state-error
  background error

.notransition
  transition none !important

.progress-button[data-horizontal]
  .progress-inner
    top 0
    width 0
    height 100%
    transition width 0.3s, opacity 0.3s

.progress-button[data-style="shrink"]
  overflow hidden
  transition transform 0.2s, background-color 0.3s

.progress-button[data-style="shrink"][data-horizontal]
  .content
    transition opacity 0.3s, transform 0.3s, background-color 0.3s

.progress-button[data-style="shrink"][data-horizontal] .content::before,
.progress-button[data-style="shrink"][data-horizontal] .content::after
  top 100%
  right auto
  left 50%
  transition opacity 0.3s
  transform translateX(-50%)

.progress-button[data-style="shrink"][data-horizontal].state-loading
  transform scaleY(0.3)
  .content
    opacity 0

.progress-button[data-style="shrink"][data-horizontal].state-success .content,
.progress-button[data-style="shrink"][data-horizontal].state-error .content
  transform translateY(-100%)

.progress-button__more {
  position absolute
  background-color primary
  border-left 1px solid lighten(@background-color, 10%)
  top 0
  size = 1rem
  right 0
  padding 1.75 * size 1.5 * size 1.75 * size 0.5 * size
  width size
  &:hover {
    background-color darken(@background-color, 10%)
  }
  .progress-button__more__content {
    transform translate3d(0, 0, 0)
    position absolute
    text-align right
    top 64px
    min-width 15rem
    height 0
    /* max-height 15rem */
    background-color @background-color
    right 0
    overflow-y hidden
    z-index 5
    border-left 1px solid darken(@background-color, 10%)
    border-right 1px solid darken(@background-color, 10%)
    border-bottom 1px solid darken(@background-color, 10%)
    transition height .3s, box-shadow .3s

    .progress-button__more__content__item {
      font-size .8rem
      border-top 1px solid darken(@background-color, 10%)
      padding-right 1rem
      transition padding-right .3s, background-color .2s
      &:hover {
        background-color darken(@background-color, 10%)
        padding-right @padding-right + 1rem
      }
    }
  }
  &.active {
    .arrow-down {
      transform rotateZ(180deg)
    }
    .progress-button__more__content {
      height 156px
      @extend .shadow-3dp
    }
  }
  .arrow-down {
    width 0
    height 0
    border-left 0.5 * size solid transparent
    border-right 0.5 * size solid transparent
    border-top 0.5 * size solid dark
    transition transform .3s, background-color .2s
  }
}

</style>
