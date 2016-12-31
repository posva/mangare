<template>
  <!-- :style="style" -->
  <!-- @click="handleClick" -->
  <v-touch class="page-preview"
           tag="div"
           ref="container"
           @tap.prevent="handleTap"
           @swipeleft="$emit('next')"
           @swiperight="$emit('previous')"
           @press="toggleOverlay"
           :press-options="pressOptions"
  >
    <!-- :style="imageStyle" -->
    <img v-if="pageUrl && imageReady"
         :src="pageUrl"
         class="page-preview__image"
         title="Next Page"
    />
    <div v-else class="page-preview__loader">
      <div class="page-preview__loader-container">
        <Spinner/>
        <p class="page-preview__loader__text"
        >{{ loadingPageMessage }}</p>
        <img class="page-preview__loader__manga-image"
             :alt="manga && manga.name"
             :src="manga && manga.image"/>
        <p class="page-preview__loader__text"
        >{{ chapterMessage }}</p>
        <router-link :to="mangaLink"
        >Go Back to {{ manga && manga.name }}</router-link>
      </div>
    </div>
    <div class="page-preview__overlay"
         v-if="displayOverlay"
    >
      <div class="page-preview__overlay__previous-page">
        Swipe right / ←
        <br/>
        Go to previous page
      </div>
      <div class="page-preview__overlay__exit">
        Tap outside / ESC
        <br/>
        Go back to the manga
      </div>
      <div class="page-preview__overlay__next-page">
        Tap / Swipe Left / →
        <br/>
        Go to next page
      </div>
    </div>
  </v-touch>
  </div>
</template>

<script>
import Spinner from 'src/components/Spinner.vue'

export default {
  name: 'PagePreview',
  components: { Spinner },

  data () {
    return {
      imageReady: true,
      displayOverlay: false,
      pressOptions: {
        time: 400
      }
    }
  },

  computed: {
    loadingPageMessage () {
      return `Loading page ${this.pageIndex}/${this.pageCount || '?'}`
    },
    chapterMessage () {
      return `Chapter ${this.chapterIndex}/${this.chapterCount}`
    },
    chapterCount () {
      return this.manga && this.manga.chapterCount || '?'
    }
  },

  props: {
    manga: Object,
    pageCount: [Number, String],
    pageUrl: String,
    pageIndex: [Number, String],
    chapterIndex: [Number, String],
    mangaLink: Object
  },

  methods: {
    handleTap (e) {
      // Do nothing if loading
      if (!this.imageReady) return
      if (this.displayOverlay) {
        this.displayOverlay = false
        return
      }
      if (this.$refs.container.$el === e.target) {
        this.$emit('exit')
      } else {
        this.$emit('next')
      }
    },
    toggleOverlay () {
      this.displayOverlay = true
    }
  },

  watch: {
    pageUrl (url) {
      this.displayOverlay = false
      // Use a timeout to prevent the image from appearing when
      // the connection is fast
      const timeout = setTimeout(() => this.imageReady = false, 180)
      const img = new Image()
      img.onload = () => {
        clearTimeout(timeout)
        this.imageReady = true
      }
      img.onerror = () => {
        clearTimeout(timeout)
        this.imageReady = true
        // TODO add error image
      }
      img.src = url

      // TODO precache next 5 images
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette';

.page-preview {
  position: fixed;
  display: flex;
  z-index: 20;
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
  transition: opacity .3s;
  background-color: clear;

  &:hover {
    cursor: zoom-out;
  }

  &__image {
    max-height: 100%;
    max-width: @max-height;
    margin: auto;

    &:hover {
      cursor: pointer;
    }
  }

  &__overlay {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.9);
    color: clear;
    display: flex;
    height: 100%;
    justify-content: space-between;
    margin: auto;
    position: fixed;
    font-size: 2rem;
    width: 100%;

    & > div {
      margin: 0.5rem;
    }

    &__previous-page {
      text-align: left;
    }

    &__next-page {
      text-align: right;
    }

    &__exit {
      text-align: center;
    }
  }

  &__loader {
    cursor: initial;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;

    &-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__text {
      text-align: center;
    }

    &__manga-image {
      max-width: 100px;
      height: 158px;
      border-radius: 2px;
      margin-bottom: .7rem;
      position: relative;

      &:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('https://placeholdit.imgix.net/~text?txtsize=33&txt=No%20Image&w=100&h=158');
      }
    }
  }
}

</style>
