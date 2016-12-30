import * as types from './types.js'

const state = {
  pendingRequests: 0
}

const mutations = {
  [types.START_REQUEST] (state) {
    ++state.pendingRequests
  },
  [types.END_REQUEST] (state) {
    state.pendingRequests = Math.max(
      0,
      state.pendingRequests - 1
    )
  }
}

const actions = {}

const getters = {
  [types.PENDING_REQUESTS]: state => state.pendingRequests
}

export default {
  state,
  getters,
  mutations,
  actions
}

export {
  actions,
  getters,
  mutations,
  types,
  state
}
