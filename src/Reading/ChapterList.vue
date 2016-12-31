<template>
  <div>
    <table class="chapters">
      <thead>
        <tr class="chapters__header">
          <th>Chapter</th>
          <th>Title</th>
          <th>Page count</th>
          <th>Published</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(chapter, cIndex) in chapters">
          <tr class="chapters__row">
            <td class="chapter__row__index">{{ cIndex + 1 }}</td>
            <td class="chapter__row__title">
              <a @click.prevent="togglePreview(cIndex)" href="#">{{ chapter.name }}</a>
            </td>
            <td class="chapter__row__page-count">{{ chapter.pageCount ? chapter.pageCount : '?' }}</td>
            <td class="chapter__row__published" :title="formattedDate(chapter.date)">{{ chapter.date | formattedDate }}</td>
            <td class="chapter__row__actions">
              <!-- <chapter-actions :chapter="chapter"></chapter-actions> -->
            </td>
          </tr>
          <tr class="chapter__preview-tr no-highlight">
            <td colspan="5">
              <div class="chapter__preview"
                   transition="height"
                   :data-image="cIndex"
                   v-show="isPreviewVisible(cIndex)">
                <div v-if="!isLoading(cIndex)"
                     class="chapter__preview-inner">
                  <div class="chapter__preview__page-image"
                       :key="cIndex"
                       v-for="(page, pageIndex) in chapter.pages">
                    <router-link tag="img"
                                 v-lazy="page"
                                 :to="pageLink(pageIndex)"
                    >
                    </router-link>
                  </div>
                </div>
                <div v-else
                     class="spinner-container">
                  <div class="spinner-div">
                    <Spinner/>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
// import ChapterActions from './ChapterActions'
import Spinner from 'src/components/Spinner.vue'
import { FETCH_CHAPTER } from './module/types.js'
import { mapActions } from 'vuex'
import { formattedDate } from 'src/shared/utils.js'

export default {
  name: 'ChapterList',
  props: {
    chapters: Array,
    currentPreview: Number
  },

  computed: {
    currentPages () {
      this.chapters
      return this.currentPreview > -1
           ? this.chapters[this.currentPreview].pages
           : []
    }
  },

  methods: {
    isLoading (index) {
      return this.currentPreview === index && !this.chapters[index].pages
    },
    isPreviewVisible (index) {
      return this.currentPreview === index
    },
    openPage (index) {
      // TODO use a link instead
    },
    pageLink (pageIndex) {
      return {
        name: 'page',
        params: {
          mangaId: this.$route.params.mangaId,
          chapter: this.currentPreview + 1,
          page: pageIndex + 1
        }
      }
    },
    togglePreview (index) {
      this.$emit(
        'current-preview',
        this.currentPreview === index ? -1 : index
      )
    },
    formattedDate,
    ...mapActions({
      fetchChapter: FETCH_CHAPTER
    })
  },

  components: {
    // ChapterActions,
    Spinner
  },

  watch: {
    currentPreview (currentPreview, old) {
      if (currentPreview !== old && currentPreview > -1) {
        // fetch the chapter if necessary
        if (this.chapters && !this.chapters[currentPreview].pages) {
          this.fetchChapter({
            mangaId: this.$route.params.mangaId,
            chapter: this.chapters[currentPreview]._id
          })
        }
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'

previewMaxHeight = 140px
previewBorder = 2px
previewMargin = 2px

.height-transition {
  transition all .3s ease
  overflow hidden
}

.height-enter, .height-leave {
  height 0 !important
}

.chapters {
  width 100%
  border-spacing 0
  overflow hidden
  p, h3 {
    margin 0
  }
  tr {
    height 2rem
  }
  .chapter__preview-tr {
    height initial
    td {
      padding 0
      border none
    }
  }

  .chapter__preview {
    height previewMaxHeight + 2 * previewBorder + 2 * previewMargin + 32px
  }
  .chapter__preview-inner {
    padding 16px 0
    display flex
    width calc(100vw - 32px - 16px)
    overflow-x auto
    flex-wrap nowrap
    align-items flex-start
    justify-content flex-start
  }

  tbody {
    tr:not(.no-highlight):hover {
      transition background-color .2s
      background-color darken(clear, 10%)
    }
  }

  td {
    border-top 1px rgba(0,0,0,.12) solid
  }

  th, td {
    text-align right
    vertical-align middle
  }
  tr th:nth-child(n+3), tr td:nth-child(n+3) {
    padding 0 2rem 0 0
  }
  tr td:nth-child(2), tr th:nth-child(2) {
    text-align left
    padding 0 1rem
  }
}

.chapters__row__index {
  width 1rem
}

.chapter__row__title {
  min-width 15rem
  a {
    color primary
  }
}

.chapter__preview__page-image {
  border previewBorder solid black
  margin previewMargin
  img {
    /* TODO Use a placeholder image instead directly into lazy options */
    min-height previewMaxHeight
    max-height previewMaxHeight
    min-width 87px
    &:hover {
      cursor zoom-in
    }
  }
}

.spinner-container {
  height 100%
  display flex
  align-items center
  justify-content center
  @media (max-width 700px) {
    max-width 100%
  }
  @media (max-width 400px) {
    max-width 400px
  }
}

.spinner-div {

}
</style>
