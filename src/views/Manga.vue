<template>
  <div class="manga">
    <div class="manga__banner">
      <div class="manga__banner__background" :style="bannerStyle">
      </div>
      <div class="manga__banner__filter">
      </div>
      <div class="manga__banner__title">
        <h2>{{ manga.name }}</h2>
      </div>
    </div>
    <div class="manga__content">
      <img v-if="manga.image" :src="manga.image">
      <p>{{ manga.description }}</p>
      <p>{{ manga.chapterCount }} chapters</p>
      <chapter v-for="chapter in manga.chapters" :chapter="chapter"></chapter>
    </div>
  </div>
</template>

<script>
import Chapter from '../components/Chapter'
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
    bannerStyle () {
      return {
        'background-image': 'url(' + this.manga.image + ')',
        'background-position-y': this.imageOffset + 'px'
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
      this.imageOffset = window.scrollY * 0.6 - 45
    }

    window.addEventListener('scroll', this.onScroll)
  },
  destroy () {
    window.removeEventListener('scroll', this.onScroll)
  },
  components: {
    Chapter
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'
@import '../assets/style/flex'

.manga
  width 100%

.manga__content
  padding 1rem

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
  h2
    font-size 2rem
    text-align center
    color clear

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
    height 110%
    margin: -0.6rem
    background-size cover
    filter blur(.6rem)
</style>
