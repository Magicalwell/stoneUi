import Directives from "./directives/index";
const install = function (Vue) {
  const components = require.context("./components", true, /index.js/);
  components.keys().forEach((element) => {
    Vue.use(components(element).default);
  });
  Vue.use(Directives);
};

export default {
  install,
};
