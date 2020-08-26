import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import auth from './modules/auth'
import camera from './modules/camera'
import clip from './modules/clip'
import detection from './modules/detection'
import bridge from './modules/bridge'
import track from './modules/track'
import stream from './modules/stream'

Vue.use(Vuex)

// Make Axios play nice with Django CSRF
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


export default new Vuex.Store({
  modules: {
    auth,
    camera,
    clip,
    detection,
    bridge,
    track,
    stream,
  },

  state: {
  },

  mutations: {
  }
})