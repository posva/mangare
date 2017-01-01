import * as types from './types.js'

const state = {
  pendingRequests: 0,
  failed: false
}

const mutations = {
  [types.START_REQUEST] (state) {
    return ++state.pendingRequests
  },
  [types.SET_FAILED_STATE] (state, failed) {
    state.failed = failed
  },
  [types.END_REQUEST] (state) {
    return state.pendingRequests = Math.max(
      0,
      state.pendingRequests - 1
    )
  }
}

const actions = {
}

const getters = {
  [types.PENDING_REQUESTS]: state => state.pendingRequests,
  [types.FAILED]: state => state.failed
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
