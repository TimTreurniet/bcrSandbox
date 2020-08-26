import cameraService from '../../services/entities/cameraService'

const state = {
  active: null,
  cameras: []
}

const getters = {
  active: state => {
    return state.active
  },
  cameras: state => {
    return state.cameras
  }
}

// TODO build receiveWebSocket function (in every entity)
const actions = {
  setActiveCamera({ commit }, camera) {
    commit('setActiveCamera', camera)
  },
  getCameras ({ commit }) {
    cameraService.fetchCameras()
    .then(cameras => {
      commit('setCameras', cameras)
    })
  },
  addCamera({ commit }, camera) {
    cameraService.postCamera(camera)
    .then(() => {
      commit('addCamera', camera)
    })
  },
  deleteCamera( { commit }, msgId) {
    cameraService.deleteCamera(msgId)
    commit('deleteCamera', msgId)
  }
}

const mutations = {
  setActiveCamera(state, camera) {
    state.active = camera
  },
  setCameras (state, cameras) {
    state.cameras = cameras
  },
  addCamera(state, camera) {
    state.cameras.push(camera)
  },
  deleteCamera(state, msgId) {
    state.cameras = state.cameras.filter(obj => obj.id !== msgId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}