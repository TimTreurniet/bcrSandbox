import bridgeService from '../../services/entities/bridgeService'

const state = {
  bridges: [],
  heatmap: null,
}

const getters = {
  bridges: state => {
    return state.bridges
  },
  heatmap: state => {
    return state.heatmap
  },
  
}

// TODO build receiveWebSocket function (in every entity)
const actions = {
  getHeatmap ({ commit }, pl) {
    bridgeService.getHeatmap(pl)
    .then(heatmap => {
      commit('setHeatmap', heatmap)
    })
  },
  getBridges ({ commit }) {
    bridgeService.fetchBridges()
    .then(bridges => {
      commit('setBridges', bridges)
    })
  },
  addBridge({ commit }, bridge) {
    bridgeService.postBridge(bridge)
    .then(() => {
      commit('addBridge', bridge)
    })
  },
  deleteBridge( { commit }, msgId) {
    bridgeService.deleteBridge(msgId)
    commit('deleteBridge', msgId)
  },
}

const mutations = {
  setHeatmap (state, heatmap) {
    state.heatmap = heatmap
  },
  setBridges (state, bridges) {
    state.bridges = bridges
  },
  addBridge(state, bridge) {
    state.bridges.push(bridge)
  },
  deleteBridge(state, msgId) {
    state.bridges = state.bridges.filter(obj => obj.id !== msgId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}