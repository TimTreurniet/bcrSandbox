import streamService from '../../services/entities/streamService'

const state = {
    stream: {
        track_id: null,
        clip_id: null,
        skip: 0,
        filter_bbox: true
    },
    draw_bbox: true
}

const getters = {
    active: state => {
        return state.stream
    }
}

const actions = {
  startStream({ commit }, streamObj) {
    // eslint-disable-next-line
    console.log('startStream: %s', JSON.stringify(streamObj))
    streamService.startStream(streamObj)
    commit('startStream', streamObj)
  },
  startNextStream({ commit }) {
    const streamObj = state.stream
    streamObj.skip += 1
    streamService.startStream(streamObj)
    commit('startStream', streamObj)
  },
  startPrevStream({ commit }) {
    const streamObj = state.stream
    streamObj.skip -= 1
    streamService.startStream(streamObj)
    commit('startStream', streamObj)
  },
  stopStream({ commit }) {
    // eslint-disable-next-line
    console.log('stopStream')
    streamService.stopStream()
    commit('stopStream')
  },
  setBoundingBox({ commit }, drawBbox) {
    streamService.setBoundingBox(drawBbox)
    commit('setBoundingBox', drawBbox)
  }
}

const mutations = {
    startStream(state, streamObj) {
        state.stream = streamObj
    },
    stopStream(state) {
        state.stream = {
            track_id: null,
            clip_id: null,
            skip: null,
            filter_bbox: null,
        }
    },
    setBoundingBox(state, drawBbox) {
      state.draw_bbox = drawBbox
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}