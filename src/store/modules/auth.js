const state = {
  user: {},
  isModalOpen: false,
  isAuthenticated: true,
  jwt: localStorage.getItem('token')
}

const getters = {
  user: state => {
    return state.user
  },
  isModalOpen: state => {
    return state.isModalOpen
  },
  isAuthenticated: state => {
    return state.isAuthenticated
  },
  jwt: state => {
    return state.jwt
  }
}

const actions = {
  authenticate ({commit}, credentials) {
    if (credentials) {
      const {username, password} = credentials;
      return 200
    } else {
      return 400
    }
  },
  authenticateOrToggleModal ({commit}, next) {
    return 200
  },
  logout ({commit}) {
    commit('setUser', {user:null, isAuthenticated:false})
    commit('removeToken')
    commit('toggleModal')
  },
  toggleModal ({commit}) {
    commit('toggleModal')
  },
}

const mutations = {
  setUser(state, {user, isAuthenticated}) {
    state.user = user
    state.isAuthenticated = isAuthenticated
  },
  updateToken(state, newToken) {
    // TODO: For security purposes, take localStorage out of the project.
    localStorage.setItem('token', newToken);
    state.jwt = newToken;
  },
  removeToken(state) {
    // TODO: For security purposes, take localStorage out of the project.
    localStorage.removeItem('token');
    state.jwt = null;
  },
  toggleModal(state) {
    state.isModalOpen = !state.isModalOpen;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}