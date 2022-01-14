const components = require.context("./src", true, /.js$/);
const Directives = {};
Directives.install = function (Vue) {
  components.keys().forEach((element) => {
    Vue.directive(
      components(element).default.name,
      components(element).default
    );
  });
};
export default Directives;
