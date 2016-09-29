<template>
  <div class="_flex">
    <SearchBar :disabled="!mangaList.length" v-model="searchQuery" @change="updateQuery"/>
    </search-bar>
    <div v-if="isReady" class="search-resutls">
      <MangaCard v-for="manga in searchResults"
                 :manga="manga"
      />
    </div>
    <div v-else class="search-message">
      <img v-show="mangaList.length" src="../assets/img/gon.png">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

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
    },
    ...mapGetters(['mangaList'])
  },
  methods: {
    updateQuery () {
      let route = {
        name: this.$route.name,
        query: {
          query: this.searchQuery
        }
      }

      this.$router.replace(route)
    },
    ...mapActions(['fetchMangaList'])
  },
  created () {
    this.searchQuery = this.$route.query.query || ''
    if (!this.mangaList.length) {
      // this.$progress.start()
      this.fetchMangaList()
          // .then(() => this.$progress.finish())
          // .catch(() => this.$progress.failed())
    }
  },
  components: {
    SearchBar,
    MangaCard
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette';
@import '../assets/style/flex';

.search-message {
  baseSize = 148px
  img {
    max-width: baseSize;
  }
  @extend .flex;
  font-size: 2rem;
  @media (max-width 700px) {
    font-size: 1rem;
  }
  font-weight: 300;
  flex-direction: column;
}

.search-resutls {
  @extend .flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
