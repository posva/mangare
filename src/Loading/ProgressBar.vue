<template>
  <div class="pb"
       :style="style"
  ></div>
</template>

<script>
import { mapGetters } from 'vuex'
import { types } from './module'

const incrementDelay = 300
const increment = 0.05
const maxProgress = 0.7

export default {
  data () {
    return {
      disappearing: false,
      currentProgress: 0
    }
  },

  computed: {
    ...mapGetters({
      pendingRequests: types.PENDING_REQUESTS
    }),
    style () {
      return {
        opacity: +(!!this.pendingRequests || this.disappearing),
        width: `${Math.round(100 * this.progress)}%`
      }
    },
    progress () {
      return this.pendingRequests
           ? this.currentProgress / this.pendingRequests
           : 1
    },
    maxProgress () {
      return increment * this.pendingRequests
    }
  },

  methods: {
    resetProgress () {
      this.currentProgress = increment / (this.pendingRequests || 0)
      this.disappearing = false
      clearTimeout(this.disappearTimeout)
      setTimeout(() => this.increment(), incrementDelay)
    },
    increment () {
      if (this.currentProgress < maxProgress * this.pendingRequests) {
        this.currentProgress += increment
        setTimeout(() => this.increment(), incrementDelay)
      }
    }
  },

  watch: {
    pendingRequests (pending, old) {
      if (pending === old) return
      if (!old) {
        // new loading clear previous timeouts and stuff
        this.resetProgress()
      } else if (pending > 0) {
        if (pending > old) {
          setTimeout(() => this.increment(), incrementDelay)
        } else { // less requests
          this.currentProgress = (this.currentProgress / old) * pending
        }
      } else {
        this.disappearing = true
        this.disappearTimeout = setTimeout(() => this.disappearing = false, 500)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.pb {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  height: 4px;
  transition: width ease-out .2s, opacity .6s;
  background-color: #20a1ff;

  &--fail {
    background-color: #dc0707;
  }
}
</style>
