<template>
<figure v-link="route(manga)" class="manga-card">
  <div>
    <img class="manga-card__image" alt="manga.name" :src="image(manga)">
    <figcaption class="manga-card__hover">
    </figcaption>
    <div>
      <span class="manga-card__title" v-html="manga.highlighted"></span>
    </div>
  </div>
</figure>
</template>

<script>
export default {
  props: {
    manga: Object
  },
  methods: {
    image (manga) {
      return manga.image || 'https://placeholdit.imgix.net/~text?txtsize=33&txt=%F0%9F%8D%99Mangare&w=221&h=350'
    },
    route (manga) {
      return {
        name: 'manga',
        params: {
          mangaId: manga._id
        }
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'
@import '../assets/style/flex'
@import '../assets/style/shadow'

.manga-card
  position relative
  float left
  overflow hidden
  margin 1rem
  min-width 120px
  max-width 220px
  height 360px
  width 100%
  text-align center
  cursor pointer
  border solid 1px darken(clear, 20%)
  border-radius 2px
  font-weight 500

  .manga-card__hover
    backface-visibility hidden
    position absolute
    top auto
    left 0
    width 100%
    bottom 0
    padding 1em
    height 3.75em
    background lighten(clear, 20%)
    color #3c4a50
    transition transform 0.35s
    // transform translate3d(0,100%,0)

  img.manga-card__image
    position relative
    display block
    min-height 100%
    max-width 100%

  em
    font-style normal
    font-weight 600
    color darken(primary, 30%)

</style>

