import Vue from 'vue'
import store from 'src/vuex/store'
import ProgressButton from 'src/components/ProgressButton'
import { timeout } from 'src/utils'

describe.skip('ProgressButton.vue', () => {
  let vm, progress
  before(() => {
    vm = new Vue({
      store,
      el: 'body',
      data: {
        text: 'Download'
      },
      replace: false,
      template: '<div><progress-button id="0" v-ref:progress>{{text}}</progress-button></div>',
      components: { ProgressButton }
    })
    progress = vm.$refs.progress
  })

  it('display text', (done) => {
    progress.$el.should.contain.text('Download')
    vm.text = 'Loading'
    vm.$tick().then(() => {
      progress.$el.should.contain.text('Loading')
    }).then(done, done)
  })

  it('switches states when starting a download', (done) => {
    progress.$el.disabled.should.be.false
    progress.state.should.equal('')
    progress.start()
    progress.state.should.equal('state-loading')
    progress.$tick().then(() => {
      progress.$el.disabled.should.be.true
      progress.finish()
      return timeout(350)
    }).then(() => {
      progress.$el.disabled.should.be.true
      progress.state.should.equal('state-success')
    }).then(done, done)
  })
})
