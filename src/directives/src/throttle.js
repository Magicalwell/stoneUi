const throttle = function (fun, wait) {
  let last, deferTimer;
  return function (...args) {
    let that = this;
    let now = +new Date();
    if (last && now < last + wait) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fun.apply(that, args);
      }, wait);
    } else {
      last = now;
      fun.apply(that, args);
    }
  };
};
export default {
  name: "throttle",
  inserted: function (el, binding) {
    let [fn, event = "click", time = 300] = binding.value;
    el.addEventListener(event, throttle(fn, time));
  },
};
