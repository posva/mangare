<template>
  <div class="_flex">
    <search-bar :value.sync="searchQuery" @change="updateQuery">
    </search-bar>
    <div v-show="searchQuery" class="search-resutls">
      <div class="manga-card"
          v-for="manga in searchResults">
        <a v-link="mangaRoute(manga)">
          <img :src="manga.image">
          <div>
            <span class="manga-card__title" v-html="manga.highlighted"></span>
          </div>
        </a>
      </div>

      <ul>
        <li v-for="manga in mangaList | filterBy searchQuery in 'name' | limitBy 20"
            transition="item">
          <a v-link="mangaRoute(manga)">{{ manga.name }}</a>
        </li>
      </ul>
    </div>
    <div v-show="!searchQuery" class="search-message">
      <img src="../assets/img/gon.png">
      <p>What do you want to read today?</p>
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
  computed: {
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
    if (!this.mangaList.length) {
      this.fetchMangaList(this.$http.get('/api/mangas'))
    }
  },
  components: {
    SearchBar
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'
@import '../assets/style/flex'

.manga-card
  display inline-block
  border solid 1px
  font-weight 500
  em
    font-style normal
    font-weight 600
    color darken(primary, 30%)

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
</style>
