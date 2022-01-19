// function createGlobelFliter({ value, data }) {
//   console.log(arguments);
//   console.log(data);
//   return value * 2;
// }

const globelFliter = {};
globelFliter.install = function (Vue, config) {
  const keys = Object.keys(config);
  keys.forEach((item) => {
    if (/Filter$/.test(item)) {
      console.log(config[item]);
      Vue.filter(item, (value) => {
        for (let val of config[item]) {
          if (val.id == value) return val.value;
        }
      });
    }
  });
  // for (let item of config.) { channelFilter
  //   console.log(item);
  // }
};
export default globelFliter;
