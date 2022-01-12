const install = function (Vue) {
  const components = require.context("./components", true, /index.js/);
  components.keys().forEach((element) => {
    Vue.use(components(element).default);
  });
};

export default {
  install,
};
