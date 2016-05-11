<template>
<figure v-link="route(manga)" class="manga-card">
  <img class="manga-card__image" :title="manga.name" :src="image(manga)">
  <figcaption class="manga-card__hover">
    <div class="manga-card__title-container">
      <h2 v-fit="manga.name" class="manga-card__title">{{ manga.name }}</h2>
    </div>
  </figcaption>
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
  },
  directives: {
    fit () {
      requestAnimationFrame(() => {
        const maxHeight = this.el.parentNode.offsetHeight
        let height = this.el.offsetHeight
        let fontSize = parseInt(window.getComputedStyle(this.el).fontSize)
        // let 1rem of distance
        while (height > maxHeight - 2 * fontSize) {
          this.el.style.fontSize = `${--fontSize}px`
          // 1rem padding on parent
          this.el.parentNode.style.padding = `${fontSize}px`
          height = this.el.offsetHeight
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'
@import '../assets/style/flex'

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

  &:hover
    .manga-card__hover
      transform translate3d(0,0,0)
      opacity .8
      background-color dark
      color clear


  .manga-card__hover
    backface-visibility hidden
    position absolute
    top auto
    left 0
    width 100%
    bottom 0
    height 100%
    background lighten(clear, 20%)
    color dark
    transition transform 0.35s,
               opacity 0.35s,
               color 0.35s,
               background-color 0.35s
    transform translate3d(0,80%,0)

    @extend .flex
    flex-direction column
    justify-content flex-start

  img.manga-card__image
    position relative
    display block
    min-height 100%
    max-width 100%

  em
    font-style normal
    font-weight 600
    color darken(primary, 30%)

  .manga-card__title-container
    padding 1em
    height .2 * @height
    @extend .flex
  .manga-card__title
    font-size 1.5rem
    text-align center
    display inline-block
    margin 0

</style>

