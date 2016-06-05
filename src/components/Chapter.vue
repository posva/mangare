<template>
  <div class="chapter">
    <h3>
      <a href="#" @click.prevent="showPages">{{ chapter.name }}</a>
    </h3>
    <div v-show="open" class="chapter__pages">
      <p v-show="loading">Loading...</p>
      <div v-else>
        <progress-button v-ref:progress @click="download" :id="chapter._id"></progress-button>
        <p>{{ pages.length | json }} pages</p>
        <img class="chapter__page__image" v-for="page in pages" :src="page">
      </div>
    </div>
  </div>
</template>

<script>
import fetchival from 'fetchival'
import ProgressButton from './ProgressButton'
import {
  downloads
} from '../vuex/getters'
import {
  downloadChapter
} from '../vuex/actions'

export default {
  vuex: {
    actions: {
      downloadChapter
    },
    getters: {
      downloads
    }
  },
  props: {
    chapter: Object
  },
  computed: {
    current () {
      return this.downloads && this.chapter ? (this.downloads[this.chapter._id] || 0) : 0
    },
    chapters () {
      return fetchival(`/api/mangas/${this.$route.params.mangaId}/chapters/${this.chapter._id}`)
    }
  },
  data () {
    return {
      pages: [],
      open: false,
      loading: false
    }
  },
  methods: {
    showPages () {
      this.open = !this.open
      if (this.pages.length) return
      this.loading = true
      this.chapters.get()
      .then((chapter) => {
        this.pages = chapter.pages
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.error('Cannot retrieve chapter: ', err)
      })
    },
    download () {
      this.downloadChapter(this.chapter._id, this.pages, this.$refs.progress)
    }
  },
  components: {
    ProgressButton
  }
}
</script>

<style lang="stylus" scoped>
.chapter__page__image
  max-width: 100px
  border: 2px solid black
  margin: 2px
</style>
