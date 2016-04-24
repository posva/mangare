<template>
  <div class="chapter">
    <h3>
    <a href="#" @click.prevent="showPages">{{ chapter.name }}</a>
    </h3>
    <div v-show="open" class="chapter__pages">
      <p v-show="loading">Loading...</p>
      <div v-else>
        <progress-button v-ref:progress @click="download" :progress="progress"></progress-button>
        <p>{{ pages.length | json }} pages</p>
        <img class="chapter__page__image" v-for="page in pages" :src="page">
        <code>{{ encoded | json }}</code>
      </div>
    </div>
  </div>
</template>

<script>
import Pdf from '../../lib/jspdf.min'
import ProgressButton from './ProgressButton'

export default {
  props: {
    chapter: Object
  },
  data () {
    return {
      pages: [],
      open: false,
      encoded: '',
      progress: 0,
      loading: false
    }
  },
  methods: {
    showPages () {
      this.open = !this.open
      if (this.pages.length) return
      this.loading = true
      this.$http.get(`/api/mangas/${this.$route.params.mangaId}/chapters/${this.chapter._id}`)
      .then((response) => {
        this.pages = response.data.pages
        this.loading = false
        // const url = `https://images.weserv.nl/?url=${encodeURI('i10.mangareader.net/shingeki-no-kyojin/79/shingeki-no-kyojin-7205743.jpg')}&encoding=base64`
        // return this.$http.jsonp(url)
        // return this.$http.jsonp(`/api/mangas/${this.$route.params.mangaId}/chapters/${this.chapter._id}`)
      // }).then((response) => {
        // console.log(response)
      }).catch((err) => {
        this.loading = false
        console.error('Cannot retrieve chapter: ', err)
      })
    },
    download () {
      let imagesPromises = []
      let images = []
      this.$refs.progress.start()
      this.progress = 0.0001 // display the progress bar
      const ratio = 0.5 / this.pages.length
      this.pages.forEach((page, i) => {
        imagesPromises.push(this.$http.get(`/api/image?url=${page}`)
        .then((response) => {
          images[i] = response.data
          this.progress += ratio
        }).catch((err) => {
          console.error('Error getting image', err)
        }))
      })
      Promise.all(imagesPromises).then(() => {
        const pdf = new Pdf()
        images.forEach((image, i) => {
          if (i > 0) {
            pdf.addPage(pdf, 'a4', 'p')
            // pdf.addPage.apply(pdf, ['a4', 'p'])
          }
          pdf.addImage(image, 0, 0, 210, 297)
          this.progress += ratio
        })
        console.log('Save as', this.chapter.name)
        pdf.save(this.chapter.name + '.pdf')
      })
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
