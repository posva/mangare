<template>
  <div class="manga">
    <div class="manga__banner">
      <div class="manga__banner__background" :style="bannerStyle">
      </div>
      <div class="manga__banner__filter">
      </div>
      <div class="manga__banner__title">
        <h2>{{ title }}</h2>
        <p>{{ chapterCount }}</p>
      </div>
    </div>
    <div v-show="isReady" class="manga__content-container">
      <div class="manga__content">
        <img class="manga__content__image" v-if="manga.image" :src="manga.image">
        <p>{{ manga.description }}</p>
      </div>
      <div class="manga__chapters">
        <chapters :chapters="manga.chapters"></chapters>
      </div>
    </div>
    <div v-show="!isReady" class="manga__content-loader">
      <p>...</p>
    </div>
  </div>
</template>

<script>
import Chapters from '../components/Chapters'
import {
  manga
} from '../vuex/getters'
import {
  viewManga
} from '../vuex/actions'

export default {
  vuex: {
    actions: {
      viewManga
    },
    getters: {
      manga
    }
  },
  computed: {
    title () {
      return this.isReady ? this.manga.name : 'Opening books...'
    },
    chapterCount () {
      return this.isReady ? `${this.manga.chapterCount} chapters` : ''
    },
    isReady () {
      return this.manga && this.manga.image
    },
    banner () {
      if (this.manga && this.manga.image &&
        this.manga.image.match('cloudinary') && window.innerWidth < 700) {
        return this.manga.image.replace('upload/', 'upload/c_scale,e_blur:1188,w_700/')
      } else {
        return this.manga.image
      }
    },
    bannerStyle () {
      return {
        'background-image': 'url(' + this.banner + ')',
        transform: `translate3d(0, ${this.imageOffset}px, 0)`
      }
    }
  },
  data () {
    return {
      imageOffset: 0
    }
  },
  ready () {
    this.viewManga(this.$route.params.mangaId)
    this.onScroll = () => {
      this.imageOffset = window.scrollY * 0.7 - 45
    }

    window.addEventListener('scroll', this.onScroll, false)
  },
  destroy () {
    window.removeEventListener('scroll', this.onScroll)
  },
  components: {
    Chapters
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'
@import '../assets/style/flex'

.manga
  width 100%

.manga__content-container
  padding 2rem 0

.manga__content
  padding 0 1rem
  @extend .flex
  align-items flex-end
  justify-content space-around

  p
    flex-grow 1
    padding 0 1rem

.manga__content__image
  width = 220px
  max-width width
  @media (max-width 700px)
    max-width width * 0.4

.manga__banner
  height  14rem
  overflow hidden
  position relative

  .manga__banner__title
    padding 0 1rem
    position absolute
    top 0
    width 100%
    height @height
    @extend .flex
    flex-direction column
    color clear
    h2
      font-size 2rem
      text-align center
      letter-spacing .1rem
    p
      margin 0
      font-weight 200
      letter-spacing .15rem

  .manga__banner__filter
    position absolute
    top 0
    height @height
    width 100%
    background-color black
    opacity .5
  .manga__banner__background
    position relative
    top 0
    height @height + 4rem
    margin: -0.6rem
    background-size cover
    backface-visibility hidden
    perspective 1000
    @media (min-width 700px)
      filter blur(.6rem)

.manga__chapters {
  padding 0 1rem
  overflow-x auto
}
</style>
