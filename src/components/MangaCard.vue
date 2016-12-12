<template>
<figure class="manga-card">
  <img class="manga-card__image" :title="manga.name" :src="image">
  <figcaption class="manga-card__hover">
    <router-link :to="route">
      <div class="manga-card__title-container">
        <h2 v-fit="manga.name" class="manga-card__title">{{ manga.name }}</h2>
      </div>
    </router-link>
    <div class="manga-card__information">
      <p class="manga-card__information__chapters">{{ chapterCount }} Chapters</p>
      <div class="manga-card__information__updated-at">
        <span>Updated {{ manga.updatedAt | moment('from') }}</span>
        <button :disabled="!canRefresh" @click="refreshManga" class="manga-card__refresh-button">
          <img src="../assets/img/refresh-icon.png">
        </button>
      </div>
      <ul class="manga-card__information__actions">
        <li>
          <router-link title="Go to the Manga page"
                       :to="route"
          >Details</router-link>
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
  <div class="refreshing-banner" :class="progressClasses">
    <span>Refreshing...</span>
  </div>
</figure>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    manga: Object
  },

  computed: {
    isVisible () {
      const rect = this.$el.getBoundingClientRect()
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
      return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
    },
    canRefresh () {
      return !this.manga.image ||
        new Date() - new Date(this.manga.updatedAt) > 1000 * 69 * 60 * 24
    },
    isRefreshing () {
      return !!this.refreshingMangas[this.manga._id]
    },
    progressClasses () {
      return { active: this.isRefreshing }
    },
    chapterCount () {
      return typeof this.manga.chapterCount === 'number'
        ? this.manga.chapterCount : '?'
    },
    image () {
      this.manga.updatedAt
      return this.manga.image ||
        'https://placeholdit.imgix.net/~text?txtsize=33&txt=%F0%9F%8D%99Mangare&w=221&h=350'
    },
    route () {
      return {
        name: 'manga',
        params: {
          mangaId: this.manga._id
        }
      }
    },
    ...mapGetters(['refreshingMangas', 'pendingRefreshRequests'])
  },

  methods: {
    refreshManga () {
      /* this.$progress.start() */
      this.fetchManga(this.manga._id)
      /* .then(() => this.$progress.finish()) */
      /* .catch(() => this.$progress.failed()) */
    },
    quickRead () {
    },
    quickDownload () {
    },
    ...mapActions(['fetchManga'])
  },

  directives: {
    fit: {
      inserted (el) {
        requestAnimationFrame(() => {
          // exit if this element has been removed from the dom
          // this may happen when the user type fast enough

          if (!el || !el.parentNode) return
          const maxHeight = el.parentNode.offsetHeight
          let height = el.offsetHeight
          let fontSize = parseInt(window.getComputedStyle(el).fontSize)
          // let 1rem of distance
          while (height > maxHeight - 2 * fontSize) {
            el.style.fontSize = `${--fontSize}px`
            // 1rem padding on parent
            el.parentNode.style.padding = `${fontSize}px`
            height = el.offsetHeight
          }
        })
      }
    }
  },

  mounted () {
    this.refreshMangaTimeout = -1
    // in case a manga doesn't have an image
    if (!this.manga.image &&
        ((new Date() - new Date(this.manga.updatedAt) > 1000 * 69 * 60 * 24) ||
         !this.manga.chapterCount)
        ) {
      const refreshMangaFn = () => {
        if (this.pendingRefreshRequests < 3) {
          this.refreshManga()
        } else {
          setTimeout(refreshMangaFn, 500)
        }
      }
      this.refreshMangaTimeout = setTimeout(refreshMangaFn, 850)
    }
  },

  destroyed () {
    clearTimeout(this.refreshMangaTimeout)
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'
@import '../assets/style/flex'

.manga-card {
  position: relative;
  float: left;
  overflow: hidden;
  margin: 1rem;
  min-width: 120px;
  max-width: 220px;
  height: 360px;
  width: 100%;
  text-align: center;
  border: solid 1px darken(clear, 20%);
  border-radius: 2px;
  font-weight: 500;

  .refreshing-banner {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    background-color: clear;
    padding: .35rem;
    font-size: .75rem;
    opacity: 0;
    transform: translate3d(0,-100%,0);
    transition: transform 0.3s, opacity 0.6s

    &.active {
      opacity: 1;
      transform: translate3d(0,0,0);
    }
  }

  .manga-card__hover {
    backface-visibility: hidden;
    position: absolute;
    top: auto;
    left: 0;
    width: 100%;
    bottom: 0;
    height: 100%;
    background: lighten(clear, 20%);
    color: dark;
    transition: transform 0.35s,
                opacity 0.35s,
                color 0.35s,
                background-color 0.35s;
    transform: translate3d(0,80%,0);

    @extend .flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  img.manga-card__image {
    position: relative;
    min-height: 100%;
    max-width: 100%;
  }

  em {
    font-style: normal;
    font-weight: 600;
    color: darken(primary, 30%);
  }

  .manga-card__title-container {
    padding: 1em;
    height: .2 * @height;
    @extend .flex;
  }

  .manga-card__title {
    font-size: 1.5rem;
    color: dark;
    cursor: pointer;
    text-align: center;
    display: inline-block;
    margin: 0;
  }

  .manga-card__information {
    p {
      margin: 0;
    }

    @extend .flex;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    height: .8 * @height;

    .manga-card__information__chapters,
    .manga-card__information__updated-at {
      font-weight: 200;
    }

    .manga-card__information__updated-at {
      font-size: 1rem;
      max-height: 5rem;
      padding: 0 .5rem;
    }

    .manga-card__information__actions {
      padding: 1rem;
      margin: 0;
      align-self: flex-end;
      list-style: none;
      text-align: right;

      li {
        color: info;
        transition: transform .25s;
        transform: translate3d(0, 200%, 0);
        for i in (1..5) {
          &:nth-child({i}) {
            transition-delay: .10s + i * .05s;
          }
        }
      }

      a {
        color: primary;
        position: relative;
        text-decoration: none;
        font-size: 1.2rem;
        display: inline-block;
        margin: 2px 0;
        transition: transform .2s;

        &:hover, &:focus {
          transform: scale(.833);

          &::before {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        &::before {
          position: absolute;
          top: -2px;
          left: -7px;
          box-sizing: content-box;
          padding: 0 5px;
          width: 100%;
          height: 100%;
          border: 2px solid @color;
          content: '';
          opacity: 0;
          transition: opacity .2s, transform .2s;
          transform: scale(.833);
        }
      }
    }
  }

  /* Apply these in the end */
  &:hover {
    .manga-card__hover {
      transform: translate3d(0,0,0);
      opacity: .8;
      background-color: dark;
      color: clear;
    }

    .manga-card__title {
      color: clear;
    }

    .manga-card__information__actions li {
      transform: translate3d(0,0,0);
    }
  }

  .manga-card__refresh-button {
    vertical-align: middle;
    outline: 0;
    position: relative;
    color: clear;
    background: none;
    border: none;
    height: 100%;

    img {
      width: 16px;
    }

    &[disabled] {
      color: darken(clear, 20%);
    }

    &:hover {
      &:not([disabled]) {
        cursor: pointer;
        transform: scale(1.2);
      }
    }
  }
}
</style>

