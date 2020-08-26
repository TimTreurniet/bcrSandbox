import clipService from '../../services/entities/clipService'

const state = {
  clips: []
}

const getters = {
  clips: state => {
    return state.clips
  }
}

// TODO build receiveWebSocket function (in every entity)
const actions = {
  getClips ({ commit }) {
    clipService.fetchClips()
    .then(clips => {
      commit('setClips', clips)
    })
  },
  addClip({ commit }, clip) {
    clipService.postClip(clip)
    .then(() => {
      commit('addClip', clip)
    })
  },
  deleteClip( { commit }, msgId) {
    clipService.deleteClip(msgId)
    commit('deleteClip', msgId)
  }
}

const mutations = {
  setClips (state, clips) {
    state.clips = clips
  },
  addClip(state, clip) {
    state.clips.push(clip)
  },
  deleteClip(state, msgId) {
    state.clips = state.clips.filter(obj => obj.id !== msgId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}