import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  data:{
    unfold: "all"
  }
}).$mount('#app')

Vue.prototype.getUniqID = function () {
  return Date.now();
};