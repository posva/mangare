<template>
  <div class="_flex">
    <div class="search-container" :class="searchContainerClass">
      <input autocomplete="off" id="search-input" v-model="searchQuery"
        name="query" type="text" @change="updateQuery"
        @focus="searchFocused = true"
        @blur="searchFocused = false"
      >
      <label for="search-input">
        <span>Search</span>
      </label>
    </div>
    <div v-show="searchQuery" class="search-resutls">
      <div class="manga-card"
          v-for="manga in mangaList | filterBy searchQuery in 'name' | limitBy 20"
          transition="item">
        <a v-link="mangaRoute(manga)">
          <h5>{{ manga.name }}</h5>
          <img :src="manga.image">
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
export default {
  data () {
    return {
      mangaList: [],
      searchFocused: false,
      searchQuery: ''
    }
  },
  computed: {
    searchContainerClass () {
      return {
        filled: this.searchQuery || this.searchFocused
      }
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

<style lang="stylus">
@import '../assets/style/palette'
@import '../assets/style/flex'

.manga-card
  display inline-block
  border solid 1px

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

.search-container
  @extend .flex
  margin 1rem 2rem
  position relative
  overflow hidden
  user-select none
  font-smoothing antialised
  font-size 2rem
  @media (max-width 700px)
    font-size 1.5rem
  background-color darken(clear, 20%)
  border-radius 2rem

  &.filled
    label::before
      transform scale3d(48, 48, 1)

    &::after
      transform translate3d(-100%, 0, 0)

  &::after
    content ''
    position absolute
    width 100%
    height 2px
    background @background-color
    bottom 0
    transform translate3d(-200%, 0, 0)
    transition transform 0.3s


  label
    position absolute
    padding 0 2.5rem
    left 2rem
    top .5rem
    width 100%
    text-align left
    pointer-events none
    color clear

    &::before
      content ''
      position absolute
      left 0
      top 0
      width 2rem
      height @width
      background url(../assets/img/search.svg) no-repeat center center
      background-size 100%
      transition transform 0.3s cubic-bezier(0.7,0,0.3,1)

  input
    width 100%
    height 3rem
    font-weight 100
    border none
    outline none
    padding .5rem
    padding-left 2rem
    background-color transparent
    z-index 2
</style>
