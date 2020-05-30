import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import store from './store/index'
//import VueSocketIO from 'vue-socket.io'
//引入element组件
import './plugins/element.js'
//引入axios
import axios from 'axios'
axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(Vuex)

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http:localhost:3000/chat',  //
//
// }))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
