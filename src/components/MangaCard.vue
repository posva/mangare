<template>
<figure class="manga-card">
  <img class="manga-card__image" :title="manga.name" :src="image">
  <figcaption class="manga-card__hover">
    <div v-link="route" class="manga-card__title-container">
      <h2 v-fit="manga.name" class="manga-card__title">{{ manga.name }}</h2>
    </div>
    <div class="manga-card__information">
      <p class="manga-card__information__chapters">{{ chapterCount }} Chapters</p>
      <p class="manga-card__information__description">{{ manga.description }}</p>
      <ul class="manga-card__information__actions">
        <li>
          <a title="Go to the Manga page" v-link="route">Details</a>
        </li>
        <li>
          <a @click.stop.prevent="quickRead" title="Read last chapter online" href="#">Quick Read</a>
        </li>
        <li>
          <a @click.stop.prevent="quickDownload" title="Download last chapter online" href="#">Quick Download</a>
        </li>
      </ul>
    </div>
  </figcaption>
</figure>
</template>

<script>
export default {
  props: {
    manga: Object
  },
  computed: {
    chapterCount () {
      return typeof this.manga.chapterCount === 'number'
        ? this.manga.chapterCount : '?'
    },
    image () {
      return this.manga.image || '//placeholdit.imgix.net/~text?txtsize=33&txt=%F0%9F%8D%99Mangare&w=221&h=350'
    },
    route () {
      return {
        name: 'manga',
        params: {
          mangaId: this.manga._id
        }
      }
    }
  },
  methods: {
    quickRead () {
    },
    quickDownload () {
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
    cursor pointer
    text-align center
    display inline-block
    margin 0

  .manga-card__information
    @extend .flex
    justify-content space-between
    flex-direction column
    width 100%
    height .8 * @height
    .manga-card__information__chapters,
    .manga-card__information__description
      font-weight 200
    .manga-card__information__description
      font-size .85rem
      max-height 5rem
      text-overflow ellipsis
      padding 0 .5rem

    .manga-card__information__actions
      padding 1rem
      margin 0
      align-self flex-end
      list-style none
      text-align right

      li
        color info
        transition transform .25s
        for i in (1..5)
          &:nth-child({i})
            transition-delay .10s + i * .05s
        transform translate3d(0,200%,0)
      a
        color primary
        position relative
        text-decoration none
        font-size 1.2rem
        display inline-block
        margin 2px 0
        transition transform .2s
        &:hover, &:focus
          transform scale(.833)

          &::before
            opacity 1
            transform scale(1.2)
        &::before
          position absolute
          top -2px
          left -7px
          box-sizing content-box
          padding 0 5px
          width 100%
          height 100%
          border 2px solid @color
          content ''
          opacity 0
          transition opacity .2s, transform .2s
          transform scale(.833)

  // Apply these in the end
  &:hover
    .manga-card__hover
      transform translate3d(0,0,0)
      opacity .8
      background-color dark
      color clear

    .manga-card__information__actions
      li
        transform translate3d(0,0,0)



</style>

