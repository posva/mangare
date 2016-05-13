import Vue from 'vue'
import SearchBar from 'src/components/SearchBar'

const filled = 'filled'

describe('SearchBar.vue', () => {
  let vm, searchbar
  before(() => {
    vm = new Vue({
      data: {
        value: ''
      },
      el: 'body',
      replace: false,
      template: '<div><search-bar :value.sync="value" v-ref:searchbar></search-bar></div>',
      components: { SearchBar }
    })
    searchbar = vm.$refs.searchbar
  })

  it('has an input', () => {
    vm.$('input').should.exist
  })

  it('applies fill class when focused', (done) => {
    searchbar.$el.should.not.have.class(filled)
    searchbar.$('input').focus()
    searchbar.$tick().then(() => {
      searchbar.$el.should.have.class(filled)
      searchbar.$('input').blur()
      return searchbar.$tick()
    }).then(() => {
      searchbar.$el.should.not.have.class(filled)
    }).then(done, done)
  })

  it('applies fill when content is not empty', (done) => {
    searchbar.value.should.be.empty
    vm.value = 'Something'
    searchbar.$el.should.not.have.class(filled)
    searchbar.$tick().then(() => {
      searchbar.value.should.not.be.empty
      searchbar.$el.should.have.class(filled)
      vm.value = ''
      return searchbar.$tick()
    }).then(() => {
      searchbar.$el.should.not.have.class(filled)
    }).then(done, done)
  })
})
