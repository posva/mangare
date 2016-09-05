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
      <img v-show="mangaList.length" src="../assets/img/gon.png">
      <p>{{ message }}</p>
    </div>
    <button @click="login('posva', 'posva')">Login</button>
    <button @click="login('posva', 'fail')">Fail Login</button>
    <button @click="logout">Logout</button>
    <button @click="noAuth">Auth route</button>
    <pre>{{ res | json }}</pre>
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
import fetchival from 'fetchival'

const login = fetchival('/api/auth-token')

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
      searchQuery: '',
      token: '',
      res: ''
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
        : 'Building the library...'
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
    },
    logout () {
      this.token = ''
    },
    noAuth () {
      const noAuth = fetchival('/api/test-auth', {
        headers: {
          'Authorization': `JWT ${this.token}`
        }
      })
      noAuth.get({
      })
            .then(json => this.res = json)
            .catch(err => this.res = err)
    },
    login (username, password) {
      login.post({username, password})
           .then(json => {
             this.res = json
             this.token = json.token
           })
           .catch(err => this.res = err)
    }
  },
  created () {
    this.searchQuery = this.$route.query.query || ''
    if (!this.mangaList.length) {
      this.$progress.start()
      this.fetchMangaList()
          .then(() => this.$progress.finish())
          .catch(() => this.$progress.failed())
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
