<template>
  <button :disabled="isDisabled" :class="state" class="progress-button" data-style="shrink" data-horizontal>
    <span class="content">
      <slot></slot>
    </span>
    <span class="progress">
      <span class="progress-inner" :class="innerClass" :style="style">
      </span>
    </span>
  </button>
</template>

<script>
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
      innerClass: ''
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
buttonBackColor = #954170

success = darken(success, 20%)

progressBackColor = #258CD4

successColor = #1d9650
errorColor = #FF5555

.progress-button
  cursor pointer
  position relative
  display inline-block
  padding 0 60px
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
</style>
