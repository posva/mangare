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
/*global Image :true*/
import Pdf from '../../lib/jspdf'
import ProgressButton from './ProgressButton'
import {nextTick, timeout} from '../utils'

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
      this.progress = 0
      this.$refs.progress.start()
      let counter = 0
      const total = this.pages.length * 2
      this.pages.forEach((page, i) => {
        imagesPromises.push(this.$http.get(`/api/image?url=${page}`)
        .then((response) => {
          images[i] = {
            data: response.data,
            format: null
          }
          const image = images[i]
          return new Promise(resolve => {
            const img = new Image()
            img.onload = () => {
              image.format = img.width > img.height ? ['a3', 'l'] : ['a4', 'p']
              this.progress = ++counter / total
              resolve()
            }
            img.src = image.data
          })
        }).catch((err) => {
          console.error('Error getting image', err)
        }))
      })

      Promise.all(imagesPromises).then(() => {
        const pdf = new Pdf()
        let p = nextTick(this)
        images.forEach((image, i) => {
          p = p.then(() => {
            if (i > 0) {
              pdf.addPage.apply(pdf, image.format)
            }
            pdf.addImage(image.data, 0, 0, image.format[1] === 'l' ? 420 : 210, 297)

            this.progress = ++counter / total
            // using nextTick doesn't work
            return timeout(0)
          })
        })
        p.then(() => {
          pdf.save(this.chapter.name + '.pdf')
        })
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
