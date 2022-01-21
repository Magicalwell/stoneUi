import Directives from "./directives/index";
import stMethods from "./utils/stMethods";
import globelFliter from "./fliter";
const install = function (Vue, { store }) {
  console.log(store);
  const components = require.context("./components", true, /index.js/);
  components.keys().forEach((element) => {
    Vue.use(components(element).default);
  });
  Vue.use(Directives);
  Vue.use(globelFliter, store.state);
  // const methodsList = require.context("./utils", true, /.js$/);
  // // console.log(methodsList.resolve(methodsList.keys()[0]));
  // methodsList.keys().forEach((element) => {
  //   console.log(element);
  //   console.log(methodsList(element).default);
  //   // Vue.prototype[key] = value;
  // });
  // 目前暂无太多utils，直接import
  const globalMethods = new Map([["$stMethods", stMethods]]);
  for (let [key, value] of globalMethods.entries()) {
    Vue.prototype[key] = value; //绑定公共方法到vue原型
  }
};

export default {
  install,
};
