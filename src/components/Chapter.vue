<template>
  <div class="chapter">
    <h3>
    <a href="#" @click.prevent="showPages">{{ chapter.name }}</a>
    </h3>
    <div v-show="open" class="chapter__pages">
      <p v-show="loading">Loading...</p>
      <div v-else>
        <p>{{ pages.length | json }} pages</p>
        <img v-for="page in pages" :src="page">
        <code>{{ encoded | json }}</code>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chapter: Object
  },
  data () {
    return {
      pages: [],
      open: false,
      encoded: '',
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
    }
  }
}
</script>

<style scoped>
</style>
