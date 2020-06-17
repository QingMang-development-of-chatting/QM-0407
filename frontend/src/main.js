import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import store from './store/index'
//引入vue-socket
import VueSocketIO from 'vue-socket.io'
//引入element组件
import './plugins/element.js'
//引入axios
import axios from 'axios'
const serverPath = 'http://localhost:3000'
//const serverPath = 'http://qingmangserver.free.idcfengye.com';
axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(new VueSocketIO({
  debug: false,
  connection: serverPath,
}));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
