import Search from './views/Search'

export default function configRouter (router) {
  router.map({
    '/search': {
      name: 'search',
      component: Search
    }
  })
}
