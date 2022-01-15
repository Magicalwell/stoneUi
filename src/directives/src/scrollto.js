const scrollto = {
  name: "scroll-to",
  abort: true,
  timestart: null,
  timestamp: null,
  container: null, // 包裹内容的盒子，要是可以滚动的 el为目标元素
  options: {
    text: "3132",
  },
  bind: function (el, binding) {
    console.log(el, binding);
    // 这里优化一下 用解构赋值过滤一下传递的参数，对于必填项没有填的报错
    scrollto.options = Object.assign({}, scrollto.options, binding.value);
    console.log(scrollto.options);
    console.log(scrollto.options.el);
    console.log(document.querySelector(scrollto.options.el));
    scrollto.container = document.querySelector(scrollto.options.el);
    el.addEventListener("click", scrollto.goScroll);
  },
  unbind: function (el) {
    scrollto.options = null;
    el.removeEventListener("click", scrollto.goScroll);
  },
  goScroll(e) {
    console.log(document.querySelector(scrollto.options.el));
    e.preventDefault();
    scrollTopDistance(scrollto.container);
    scrollLeftDistance(scrollto.container);
    window.requestAnimationFrame(scrollStep);
  },
};
function scrollTopDistance(container) {
  console.log(container);
  let scrollTop = container.scrollTop;
  if (container.tagName.toLowerCase() == "body") {
    scrollTop = scrollTop || document.documentElement.scrollTop;
  }
  return scrollTop;
}
function scrollLeftDistance(container) {
  let scrollLeft = container.scrollLeft;
  if (container.tagName.toLowerCase() == "body") {
    scrollLeft = scrollLeft || document.documentElement.scrollLeft;
  }
  return scrollLeft;
}
function scrollStep(timestamp) {
  if (scrollto.abort) return;
  if (!scrollto.timestart) scrollto.timestart = timestamp;
  console.log(timestamp);
  move();
  timestamp - scrollto.timestart < scrollto.options.during
    ? window.requestAnimationFrame(scrollStep)
    : done();
}
function move() {
  console.log(77777);
}
function done() {}
// on(element, events, handler, opts = { passive: false }) {
//     if (!(events instanceof Array)) {
//       events = [events]
//     }
//     for (let i = 0; i < events.length; i++) {
//       element.addEventListener(
//         events[i],
//         handler,
//         supportsPassive ? opts : false
//       )
//     }
//   },
export default scrollto;
