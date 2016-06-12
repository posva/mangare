<template>
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
      <tr class="chapters__row" v-for="chapter in chapters">
        <td class="chapter__row__index">{{ $index + 1 }}</td>
        <td class="chapter__row__title">{{ chapter.name }}</td>
        <td class="chapter__row__page-count">{{ chapter.pageCount ? chapter.pageCount : '?' }}</td>
        <td class="chapter__row__published" :title="formattedDate(chapter.date)">{{ chapter.date | moment 'from' }}</td>
        <td class="chapter__row__actions">
          <chapter-actions :chapter="chapter"></chapter-actions>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ChapterActions from './ChapterActions'

export default {
  props: {
    chapters: Array
  },
  data () {
    return {
    }
  },
  methods: {
    formattedDate (date) {
      return this.$moment(date).calendar()
    }
  },
  components: {
    ChapterActions
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette'

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
  tbody {
    tr:hover {
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
}

.chapter__page__image {
  max-width: 100px
  border: 2px solid black
  margin: 2px
}
</style>
