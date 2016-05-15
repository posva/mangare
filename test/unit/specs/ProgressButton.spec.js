import Vue from 'vue'
import ProgressButton from 'src/components/ProgressButton'
import { timeout } from 'src/utils'

describe('ProgressButton.vue', () => {
  let vm, progress
  before(() => {
    vm = new Vue({
      data: {
        progress: ''
      },
      el: 'body',
      replace: false,
      template: '<div><progress-button :progress.sync="progress" v-ref:progress></progress-button></div>',
      components: { ProgressButton }
    })
    progress = vm.$refs.progress
  })

  it('display Download by default', () => {
    progress.$el.should.contain.text('Download')
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
