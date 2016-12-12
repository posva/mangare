<template>
  <PagePreview :page-url="currentPage"
               :page-index="currentPageIndex"
               :page-count="pageCount"
               :next-page-link="nextPageLink"
               :manga-link="mangaLink"
               :manga="manga"
               @exit="returnToManga"
  />
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

const ESC_KEY = 27
const LEFT_KEY = 37
/* const UP_KEY = 38 */
const RIGHT_KEY = 39
/* const DOWN_KEY = 39 */

const MIN_SCALE = 0.375

export default {
  name: 'Page',
  components: { PagePreview },

  computed: {
    ...mapGetters({
      manga: types.MANGA,
      chapter: types.CHAPTER,
      currentPage: types.CURRENT_PAGE,
      currentPageIndex: types.CURRENT_PAGE_INDEX,
      nextPageParams: types.NEXT_PAGE_PARAMS,
      previousPageParams: types.PREVIOUS_PAGE_PARAMS
    }),
    pageCount () {
      return this.chapter && this.chapter.pageCount
    },
    nextPageLink () {
      return {
        name: 'page',
        params: this.nextPageParams
      }
    },
    mangaLink () {
      return {
        name: 'manga',
        params: {
          mangaId: this.$route.params.mangaId
        },
        query: {
          previewChapter: this.$route.params.chapter
        }
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
    returnToManga () {
      this.$router.push(this.mangaLink)
    },
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
    },

    // private methods
    resolveManga () {
      const manga = this.$route.params.mangaId
      if (!this.manga || manga !== this.manga._id) {
        return this.fetchManga(this.$route.params.mangaId)
      } else {
        return Promise.resolve(this.manga)
      }
    },

    resolveChapter () {
      const chapter = this.$route.params.chapter
      if (!this.chapter || chapter !== this.chapter._id) {
        return this.fetchChapter({
          mangaId: this.manga._id,
          chapter: this.$route.params.chapter
        })
      } else {
        return Promise.resolve(this.chapter)
      }
    }
  },

  mounted () {
    this.keyupListener = this.handleKey.bind(this)
    document.addEventListener('keyup', this.keyupListener)

    /* this.$el.hammer.get('pinch').set({ enable: true }) */
    /* this.$el.hammer.on('pinchmove', (event) => this.pinchmove(event)) */
    const manga = this.$route.params.mangaId
    this.setCurrentPage(this.$route.params.page)

    this.resolveManga().then(() => this.resolveChapter()).then(() => {
      if (this.currentPageIndex > this.chapter.pageCount) {
        this.$router.push({
          name: 'page',
          params: {
            mangaId: manga,
            chapter: this.$route.params.chapter,
            page: this.chapter.pageCount
          }
        })
      } else if (this.currentPageIndex < 1) {
        this.$router.push({
          name: 'page',
          params: {
            mangaId: manga,
            chapter: this.$route.params.chapter,
            page: 1
          }
        })
      }
    })
  },

  watch: {
    '$route.params.page' (page) {
      this.setCurrentPage(page)
    }
  },

  beforeDestroy () {
    document.removeEventListener('keyup', this.keyupListener)
  }
}
</script>
