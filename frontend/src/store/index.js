import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username:"",
  },
  getters: {

  },
  mutations: {
    setUser(state, username0) {
      state.username = username0;
    }
  },
  actions: {

  }

})
