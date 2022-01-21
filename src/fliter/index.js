import baseMethods from "../utils/stMethods";
let list = new Map();
function createGlobelFliter(state) {
  for (let [key, data] of Object.entries(state)) {
    let valueType = baseMethods.typeOf(data);
    if (valueType === "array" && key.toLocaleLowerCase().endsWith("filter")) {
      list.set(key, data); // 将传入的state遍历存为map字典
    }
    if (valueType === "object") {
      createGlobelFliter(data); // 递归调用，深度遍历，只保存type类型为数组的，即不存在嵌套对象
    }
  }
}

const globelFliter = {};
globelFliter.install = function (Vue, config) {
  createGlobelFliter(config);
  for (let [key, value] of list) {
    Vue.filter(key, (val) => {
      if (
        baseMethods.typeOf(val) == "number" ||
        baseMethods.typeOf(val) == "string"
      ) {
        let result = value.filter((item) => item.id == val);
        return result[0].value;
      }
    });
  }
};
export default globelFliter;
