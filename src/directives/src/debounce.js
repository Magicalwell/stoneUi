const debounce = function (fn, wait, defer = false) {
  let timer, deferTimer;
  return function (...args) {
    let that = this;
    if (timer) {
      clearTimeout(timer);
    }
    if (defer && !deferTimer) {
      deferTimer = true;
      fn.apply(that, args);
    }
    timer = setTimeout(() => {
      deferTimer = null;
      !defer && fn.apply(that, args);
    }, wait);
  };
};
export default {
  name: "debounce",
  inserted: function (el, binding) {
    let [fn, event = "click", time = 300, defer = false] = binding.value;
    el.addEventListener(event, debounce(fn, time, defer));
  },
};
