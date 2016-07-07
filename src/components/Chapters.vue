<template>
  <div>
    <table class="chapters">
      <thead>
        <tr class="chapters__header">
          <th :class="getThClass('_id')"
              @click.prevent="toggleOrder('_id')">
            Chapter
            <span class="arrow" :class="getOrderClass('_id')"></span>
          </th>
          <th :class="getThClass('name')"
              @click.prevent="toggleOrder('name')">
            Title
            <span class="arrow" :class="getOrderClass('name')"></span>
          </th>
          <th :class="getThClass('pageCount')"
              @click.prevent="toggleOrder('pageCount')">
            Page count
            <span class="arrow" :class="getOrderClass('pageCount')"></span>
          </th>
          <th :class="getThClass('date')"
              @click.prevent="toggleOrder('date')">
            Published
            <span class="arrow" :class="getOrderClass('date')"></span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(cIndex, chapter) in chapterList" track-by="$index">
          <tr class="chapters__row">
            <td class="chapter__row__index">{{ chapter._id }}</td>
            <td class="chapter__row__title">
              <a @click.prevent="togglePreview(chapter._id)" href="#">{{ chapter.name }}</a>
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
                   v-show="isPreviewVisible(chapter._id)">
                <div v-show="!isLoading(chapter._id)"
                     class="chapter__preview-inner">
                  <div class="chapter__preview__page-image"
                       track-by="$index"
                       v-for="page in chapter.pages">
                    <img :src="page" @click="openPage($index)" >
                  </div>
                </div>
                <div v-show="isLoading(chapter._id)"
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
import _ from 'lodash'
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
    currentChapter () {
      return _.find(this.chapters, {_id: this.currentPreview})
    },
    currentPages () {
      return this.currentChapter
           ? this.currentChapter.pages
           : []
    },
    chapterList () {
      const sort = this.orders.reduce((sorting, {column, order}) => {
        sorting[0].push(column)
        sorting[1].push(order)
        return sorting
      }, [[], []])
      return _.take(_.orderBy(this.chapters, ...sort), this.chaptersPerPage)
    }
  },
  data () {
    return {
      currentPreview: -1,
      currentPage: 0,
      chaptersPerPage: 20,
      orders: [
        {
          column: '_id',
          order: 'desc'
        },
        {
          column: 'name',
          order: 'asc'
        },
        {
          column: 'pageCount',
          order: 'asc'
        },
        {
          column: 'date',
          order: 'asc'
        }
      ],
      loading: {}
    }
  },
  methods: {
    getThClass (column) {
      const order = this.orders[0]
      return order && order.column === column ? 'active' : ''
    },
    getOrderClass (column) {
      const order = _.find(this.orders, {column})
      return order && order.order
    },
    toggleOrder (column) {
      let order = _.remove(this.orders, {column})[0]
      order.order = order.order === 'asc' ? 'desc' : 'asc'
      this.orders.unshift(order)
    },
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
      const chapter = _.find(this.chapters, {_id: index})
      if (!chapter.pages) {
        Vue.set(this.loading, index, true)
        this.fetchChapter(this.$route.params.mangaId, chapter._id)
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
  th:not(.active) {
    opacity 0.66
  }

  .chapters__header {
    background-color darken(clear, 10%)
  }

  th {
    cursor pointer
    user-select none
    min-width 8rem
  }
  th:first-child {
    min-width 5rem
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
    max-width 100%
  }
  @media (max-width 400px) {
    max-width 400px
  }
}

.arrow {
  size = 4px
  color = dark
  display inline-block
  vertical-align middle
  width 0
  height 0
  margin-left 5px

  &.asc {
    border-left size solid transparent
    border-right size solid transparent
    border-bottom size solid dark
  }
  &.desc {
    border-left size solid transparent
    border-right size solid transparent
    border-top size solid dark
  }
}
</style>
