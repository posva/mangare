import Search from './components/Hello'

export default function configRouter (router) {
  router.map({
    '/search': {
      name: 'search',
      component: Search
    }
  })
}
