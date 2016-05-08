import Search from './views/Search'
import Manga from './views/Manga'

export default function configRouter (router) {
  router.map({
    '/search': {
      name: 'search',
      component: Search
    },
    '/manga/:mangaId': {
      name: 'manga',
      component: Manga
    }
  })

  router.redirect({
    '/': '/search'
  })
}
