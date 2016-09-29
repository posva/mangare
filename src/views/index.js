import VueRouter from 'vue-router'
import Search from './Search'
import Manga from './Manga'

export const routes = [
  {
    name: 'search',
    path: '/search',
    component: Search
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
