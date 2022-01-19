import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    channelFilter: [
      { id: 1, value: "test" },
      { id: 2, value: "ok" },
    ],
  },
  mutations: {},
  actions: {},
  modules: {},
});
