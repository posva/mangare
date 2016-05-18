<template>
  <div class="_flex">
    <search-bar :disabled="!mangaList.length" :value.sync="searchQuery" @change="updateQuery">
    </search-bar>
    <div v-if="isReady" class="search-resutls">
      <manga-card v-for="manga in searchResults"
        :manga="manga"
      ></manga-card>
    </div>
    <div v-else class="search-message">
      <img src="../assets/img/gon.png">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import {
  fetchMangaList
} from '../vuex/actions'

import {
  mangaList
} from '../vuex/getters'

import _ from 'lodash'
import { filter as fuzzy } from 'fuzzy'
import SearchBar from '../components/SearchBar'
import MangaCard from '../components/MangaCard'

const fuzzyOptions = {
  pre: '<em>',
  post: '</em>',
  extract (manga) {
    return manga.name
  }
}

export default {
  vuex: {
    actions: {
      fetchMangaList
    },
    getters: {
      mangaList
    }
  },
  data () {
    return {
      searchQuery: ''
    }
  },
  watch: {
    // Keep up with router updates
    '$route.query.query': function (query) {
      this.searchQuery = query || ''
    }
  },
  computed: {
    message () {
      return this.mangaList.length
        ? 'What do you want to read today?'
        : 'Let me organise the mangas for you'
    },
    isReady () {
      return this.mangaList.length && this.searchQuery
    },
    searchResults () {
      let results = fuzzy(this.searchQuery, this.mangaList, fuzzyOptions)
      return _.map(_.take(results, 20)
      , (manga) => {
        manga.original.highlighted = manga.string
        return manga.original
      })
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
    if (!this.mangaList.length) {
      this.fetchMangaList(this.$http.get('/api/mangas'))
    }
  },
  components: {
    SearchBar,
    MangaCard
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'
@import '../assets/style/flex'

.search-message
  baseSize = 148px
  img
    max-width baseSize
  @extend .flex
  font-size 2rem
  @media (max-width 700px)
    font-size 1rem
  font-weight 300
  flex-direction column

.search-resutls
  @extend .flex
  flex-wrap wrap
  justify-content space-around
</style>
