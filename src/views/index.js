import VueRouter from 'vue-router'
import Search from './Search'
import Manga from 'src/Reading/views/Manga'
import Chapter from 'src/Reading/views/Chapter'
import Page from 'src/Reading/views/Page'

export const routes = [
  {
    name: 'search',
    path: '/search',
    component: Search
  },

  {
    path: '/manga/:mangaId/:chapter',
    component: Chapter,
    children: [
      {
        name: 'page',
        path: ':page',
        component: Page
      },
      {
        // Go to first page if none is specified
        path: '',
        redirect (to) {
          return {
            name: 'page',
            params: {
              mangaId: to.params.mangaId,
              chapter: to.params.chapter,
              page: 1
            }
          }
        }
      }
    ]
  },

  {
    name: 'manga',
    path: '/manga/:mangaId',
    component: Manga
  },

  {
    path: '*',
    redirect: '/search'
  }
]

export default new VueRouter({
  mode: 'history',
  routes
})
