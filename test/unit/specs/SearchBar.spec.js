import Vue from 'vue'
import SearchBar from 'src/components/SearchBar'

describe('SearchBar.vue', () => {
  let vm
  before(() => {
    vm = new Vue({
      template: '<div><search-bar></search-bar></div>',
      components: { SearchBar }
    }).$mount()
  })
  it('has an input', () => {
    vm.$el.querySelector('input').should.exist
  })
})
