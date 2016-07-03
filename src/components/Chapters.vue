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
        <template v-for="(cIndex, chapter) in chapters" track-by="$index">
          <tr class="chapters__row">
            <td class="chapter__row__index">{{ $index + 1 }}</td>
            <td class="chapter__row__title">
              <a @click.prevent="togglePreview(cIndex)" href="#">{{ chapter.name }}</a>
            </td>
            <td class="chapter__row__page-count">{{ chapter.pageCount ? chapter.pageCount : '?' }}</td>
            <td class="chapter__row__published" :title="formattedDate(chapter.date)">{{ chapter.date | moment 'from' }}</td>
            <td class="chapter__row__actions">
              <chapter-actions :chapter="chapter"></chapter-actions>
            </td>
          </tr>
          <tr class="chapter__preview-tr no-highlight">
            <td colspan="5">
              <div class="chapter__preview"
                   transition="height"
                   :data-image="$index"
                   v-show="isPreviewVisible(cIndex)">
                <div v-show="!isLoading(cIndex)"
                     class="chapter__preview-inner">
                  <div class="chapter__preview__page-image"
                       track-by="$index"
                       v-for="page in chapter.pages">
                    <img :src="page" @click="openPage($index)" >
                  </div>
                </div>
                <div v-show="isLoading(cIndex)"
                     class="spinner-container">
                  <div class="spinner-div">
                    <spinner></spinner>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <page-preview v-transfer-dom
                  v-ref:page-preview
                  :pages="currentPages"
    >
    </page-preview>
  </div>
</template>

<script>
import Vue from 'vue'
import ChapterActions from './ChapterActions'
import Spinner from './Spinner'
import PagePreview from './PagePreview'
import {
  fetchChapter
} from '../vuex/actions'

export default {
  vuex: {
    actions: {
      fetchChapter
    }
  },
  props: {
    chapters: Array
  },
  computed: {
    currentPages () {
      this.chapters
      return this.currentPreview > -1
           ? this.chapters[this.currentPreview].pages
           : []
    }
  },
  data () {
    return {
      currentPreview: -1,
      loading: {}
    }
  },
  methods: {
    isLoading (index) {
      return this.currentPreview === index && this.loading[index]
    },
    isPreviewVisible (index) {
      return this.currentPreview === index
    },
    openPage (index) {
      this.$refs.pagePreview.currentPage = index
      this.$refs.pagePreview.display = true
    },
    togglePreview (index) {
      const current = this.currentPreview
      if (this.currentPreview === current) {
        this.currentPreview = this.currentPreview === index ? -1 : index
      }
      if (!this.chapters[index].pages) {
        Vue.set(this.loading, index, true)
        this.fetchChapter(this.$route.params.mangaId, this.chapters[index]._id)
            .then(() => {
              this.loading[index] = false
            })
      }
    },
    formattedDate (date) {
      return this.$moment(date).calendar()
    }
  },
  components: {
    ChapterActions,
    PagePreview,
    Spinner
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
    max-height previewMaxHeight
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
    justify-content flex-start
    padding-left 3rem
  }
}

.spinner-div {

}
</style>
