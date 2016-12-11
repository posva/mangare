<template>
  <PagePreview v-if="!loading && currentPage"
               :page-url="currentPage"
               :next-page-link="nextPageLink"
  />
  <Spinner v-else />
    <!-- v-touch:swipeleft="nextPage" -->
    <!-- v-touch:swiperight="previousPage" -->
    <!-- v-touch:pinchend="pinch" -->
    <!-- v-touch-options:pinchend="{ threshold: 100 }" -->
  <!-- <div class="page-preview" :style="style" -->
  <!-- @click="handleClick" -->
  <!-- ref="container" -->
  <!-- > -->
  <!-- <p> -->
  <!-- Hello -->
  <!-- </p> -->
  <!-- <img @click="nextPage" -->
  <!-- title="Next Page" -->
  <!-- :style="imageStyle" -->
  <!-- :src="currentPageImage"> -->
  <!-- </div> -->
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { types } from '../module'
import PagePreview from '../PagePreview.vue'
import Spinner from '../../components/Spinner.vue'

const ESC_KEY = 27
const LEFT_KEY = 37
/* const UP_KEY = 38 */
const RIGHT_KEY = 39
/* const DOWN_KEY = 39 */

const MIN_SCALE = 0.375

export default {
  name: 'Page',
  components: { PagePreview, Spinner },

  computed: {
    ...mapGetters({
      manga: types.MANGA,
      chapter: types.CHAPTER,
      currentPage: types.CURRENT_PAGE,
      nextPageParams: types.NEXT_PAGE_PARAMS,
      previousPageParams: types.PREVIOUS_PAGE_PARAMS
    }),
    nextPageLink () {
      return {
        name: 'page',
        params: this.nextPageParams
      }
    },
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
    }
  },

  data () {
    return {
      loading: false,
      display: false,
      currentPage: 0,
      scaling: false,
      scale: 1
    }
  },

  methods: {
    ...mapMutations({
      setCurrentPage: types.SET_CURRENT_PAGE
    }),
    ...mapActions({
      fetchManga: types.FETCH_MANGA,
      fetchChapter: types.FETCH_CHAPTER
    }),
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
      if (event.target === this.$refs.container) {
        this.display = false
      }
    },
    nextPage () {
      this.$router.push({
        name: 'page',
        params: this.nextPageParams
      })
    },
    previousPage () {
      this.$router.push({
        name: 'page',
        params: this.previousPageParams
      })
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
  mounted () {
    document.addEventListener('keyup', this.handleKey.bind(this))

    /* this.$el.hammer.get('pinch').set({ enable: true }) */
    /* this.$el.hammer.on('pinchmove', (event) => this.pinchmove(event)) */
    const manga = this.$route.params.mangaId
    this.setCurrentPage(this.$route.params.page)

    if (!this.manga || manga !== this.manga._id) {
      console.log('fetching')
      this.fetchManga(this.$route.params.mangaId)
             .then(() => {
               return this.fetchChapter({
                 mangaId: this.manga._id,
                 chapter: this.$route.params.chapter
               })
             })
    }
  },

  watch: {
    '$route.params.page' (page) {
      this.setCurrentPage(page)
    },
    currentPage (url) {
      console.log('load')
      this.loading = true
      const img = new Image()
      img.onload = () => this.loading = false
      img.src = url

      // TODO precache next 5 images
    }
  },

  beforeDestroy () {
    document.removeEventListener('keyup', this.handleKey)
  }
}
</script>
