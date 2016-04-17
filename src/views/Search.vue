<template>
  <div class="hello">
    <h1>Search</h1>
    <input v-model="searchQuery" @change="updateQuery">
    <p>Results for {{ searchQuery }}</p>
    <ul>
      <li v-for="manga in mangaList | filterBy searchQuery in 'name' | limitBy 10">{{ manga.name }}</li>
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
      this.$http.get('/mangas')
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>
