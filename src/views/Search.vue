<template>
  <div class="_flex">
    <SearchBar :disabled="!mangaList.length" v-model="searchQuery" @change.native="updateQuery"/>
    </search-bar>
    <div v-if="isReady" class="search-resutls">
      <MangaCard v-for="manga in searchResults"
                 :key="manga._id"
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

import map from 'lodash/map'
import take from 'lodash/take'
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
  name: 'Search',
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
      return map(take(results, 20)
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

<style>
@import '../ui/flex.css';

:root {
  --baseSize: 148px;
}

.search-message {
  & img {
    max-width: var(--baseSize);
  }
  @apply --flex;
  font-size: 2rem;

  /* Replace these with custom media queries */
  @media (max-width: 700px) {
    font-size: 1rem;
  }
  font-weight: 300;
  flex-direction: column;
}

.search-resutls {
  @apply --flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
