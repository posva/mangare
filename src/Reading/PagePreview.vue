<template>
  <!-- :style="style" -->
  <!-- @click="handleClick" -->
  <div class="page-preview"
       ref="container"
       @click="handleClick"
  >
    <!-- :style="imageStyle" -->
    <router-link v-if="pageUrl && imageReady"
                 class="page-preview__image"
                 :to="nextPageLink"
                 title="Next Page"
                 tag="img"
                 :src="pageUrl"
    />
    <div v-else class="page-preview__loader">
      <div class="page-preview__loader-container">
        <Spinner/>
        <p class="page-preview__loader__text"
        >{{ loadingPageMessage }}</p>
        <img class="page-preview__loader__manga-image"
             :alt="manga && manga.name"
             :src="manga && manga.image"/>
        <router-link :to="mangaLink"
        >Go Back to {{ manga && manga.name }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '../components/Spinner.vue'

export default {
  name: 'PagePreview',
  components: { Spinner },

  data () {
    return {
      imageReady: true
    }
  },

  computed: {
    loadingPageMessage () {
      return `Loading page ${this.pageIndex}/${this.pageCount || '?'}`
    }
  },

  props: {
    manga: Object,
    pageCount: [Number, String],
    pageUrl: String,
    pageIndex: [Number, String],
    nextPageLink: Object,
    mangaLink: Object
  },

  methods: {
    handleClick ({ target }) {
      if (this.$refs.container === target) {
        this.$emit('exit')
      }
    }
  },

  watch: {
    pageUrl (url) {
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
