<template>
  <progress-button v-ref:progress @download="download" :disabled="loading" :id="chapterId">{{ loading ? 'Loading...' : 'Download' }}</progress-button>
</template>

<script>
import fetchival from 'fetchival'
import ProgressButton from './ProgressButton'
import {
  downloads
} from '../vuex/getters'
import {
  downloadChapter,
  fetchChapter
} from '../vuex/actions'

export default {
  vuex: {
    actions: {
      downloadChapter,
      fetchChapter
    },
    getters: {
      downloads
    }
  },
  props: {
    chapter: Object
  },
  computed: {
    chapterId () {
      return `${this.chapter.name} ${this.chapter._id}`
    },
    chapters () {
      return fetchival(`/api/mangas/${this.$route.params.mangaId}/chapters/${this.chapter._id}`)
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    fetchPages () {
      if (this.chapter && this.chapter.pages && this.chapter.pages.length) {
        return new Promise((resolve) => resolve(this.pages))
      }
      this.loading = true
      return this.fetchChapter(this.$route.params.mangaId, this.chapter._id)
      .then(() => {
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.error('Cannot retrieve chapter: ', err)
      })
    },
    download () {
      this.fetchPages().then(() => {
        this.downloadChapter(this.chapter, this.$refs.progress)
      })
    }
  },
  components: {
    ProgressButton
  }
}
</script>

<style lang="stylus">
</style>
