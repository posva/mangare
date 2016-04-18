<template>
  <div>
    <h1>{{ manga.name }}</h1>
    <img v-if="manga.image" :src="manga.image">
    <p>{{ manga.chapters.length }} chapters</p>
    <ul>
      <li v-for="chapter in manga.chapters">{{ chapter.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      manga: {
        name: '',
        image: '',
        completed: false,
        chapters: []
      }
    }
  },
  route: {
    activate (transition) {
      this.$http.get(`/api/mangas/${this.$route.params.mangaId}`)
      .then((response) => {
        this.manga = response.data
        transition.next()
      }, (response) => {
        console.error('Cannot retrieve manga: ', response)
        transition.abort()
      })
    }
  }
}
</script>
