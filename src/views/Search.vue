<template>
  <div>
    <h1>Search</h1>
    <input v-model="searchQuery" @change="updateQuery">
    <p>Results for {{ searchQuery }}</p>
    <ul>
      <li v-for="manga in mangaList | filterBy searchQuery in 'name' | limitBy 20">
        <a v-link="mangaRoute(manga)">{{ manga.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mangaList: [],
      searchQuery: ''
    }
  },
  methods: {
    mangaRoute (manga) {
      return {
        name: 'manga',
        params: {
          mangaId: manga._id
        }
      }
    },
    updateQuery () {
      this.$router.go({
        replace: true,
        name: 'search',
        query: {
          query: this.searchQuery
        }
      })
    }
  },
  created () {
    this.searchQuery = this.$route.query.query || ''
  },
  route: {
    activate (transition) {
      this.$http.get('/api/mangas')
      .then((response) => {
        this.mangaList = response.data
        transition.next()
      }, (response) => {
        console.error('Cannot retrieve manga: ', response)
        transition.abort()
      })
    }
  }
}
</script>
