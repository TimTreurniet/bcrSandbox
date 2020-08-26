import detectionService from '../../services/entities/detectionService'

const state = {
  detections: []
}

const getters = {
  detections: state => {
    return state.detections
  }
}

// TODO build receiveWebSocket function (in every entity)
const actions = {
  getDetections ({ commit }) {
    detectionService.fetchDetections()
    .then(detections => {
      commit('setDetections', detections)
    })
  },
  addDetection({ commit }, detection) {
    detectionService.postDetection(detection)
    .then(() => {
      commit('addDetection', detection)
    })
  },
  deleteDetection( { commit }, msgId) {
    detectionService.deleteDetection(msgId)
    commit('deleteDetection', msgId)
  }
}

const mutations = {
  setDetections (state, detections) {
    state.detections = detections
  },
  addDetection(state, detection) {
    state.detections.push(detection)
  },
  deleteDetection(state, msgId) {
    state.detections = state.detections.filter(obj => obj.id !== msgId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}