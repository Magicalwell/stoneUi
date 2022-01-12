import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import stoneUi from "./index";
Vue.config.productionTip = false;
Vue.use(stoneUi);
new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
