<template>
  <div>
    <h1>{{ manga.name }}</h1>
    <img v-if="manga.image" :src="manga.image">
    <p>{{ manga.chapterCount }} chapters</p>
    <chapter v-for="chapter in manga.chapters" :chapter="chapter"></chapter>
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
  data () {
    return {
    }
  },
  ready () {
    this.viewManga(this.$route.params.mangaId)
  },
  components: {
    Chapter
  }
}
</script>
