<template>
  <div>
    <h1>{{ manga.name }}</h1>
    <img v-if="manga.image" :src="manga.image">
    <p>{{ manga.chapters.length }} chapters</p>
    <chapter v-for="chapter in manga.chapters" :chapter="chapter"></chapter>
  </div>
</template>

<script>
import Chapter from '../components/Chapter'
import {
  updateManga
} from '../vuex/actions'

export default {
  vuex: {
    actions: {
      updateManga
    }
  },
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
        this.updateManga(this.manga)
        transition.next()
      }, (response) => {
        console.error('Cannot retrieve manga: ', response)
        transition.abort()
      })
    }
  },
  components: {
    Chapter
  }
}
</script>
