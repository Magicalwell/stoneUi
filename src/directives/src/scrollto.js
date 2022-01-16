const scrollto = {
  name: "scroll-to",
  abort: false, //控制是否退出
  timestart: null, //开始时间
  timestamp: null, //时间戳
  container: null, // 包裹内容的盒子，要是可以滚动的 el为目标元素
  options: {
    //配置项
    text: "3132",
  },
  initialX: null, //初始X坐标
  initialY: null, //初始Y坐标
  targetX: null, //目标X坐标
  targetY: null, //目标Y坐标
  target: null, //目标元素
  process: null, //比例
  bind: function (el, binding) {
    // 这里优化一下 用解构赋值过滤一下传递的参数，对于必填项没有填的报错
    scrollto.options = Object.assign({}, scrollto.options, binding.value);
    scrollto.container = document.querySelector(scrollto.options.container);
    el.addEventListener("click", scrollto.goScroll);
  },
  unbind: function (el) {
    scrollto.options = null;
    el.removeEventListener("click", scrollto.goScroll);
  },
  goScroll(e) {
    e.preventDefault();
    scrollto.abort = false;
    scrollto.timestart = null;
    scrollto.container = document.querySelector(scrollto.options.container);
    scrollto.target = document.querySelector(scrollto.options.el);
    scrollto.initialY = scrollTopDistance(scrollto.container, true);
    scrollto.initialX = scrollLeftDistance(scrollto.container, true);
    scrollto.targetY = scrollTopDistance(scrollto.target, false);
    scrollto.targetX = scrollLeftDistance(scrollto.target, false);
    // scrollto.container.scrollTo({ top: 0, behavior: "smooth" });
    window.requestAnimationFrame(scrollStep);
  },
};
const cubic = (value) => Math.pow(value, 3);
const easeInOutCubic = (value) =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;

function scrollTopDistance(container, flag = true) {
  let scrollTop = flag ? container.scrollTop : container.offsetTop;
  if (container.tagName.toLowerCase() == "body") {
    scrollTop = scrollTop || document.documentElement.scrollTop;
  }
  return scrollTop;
}
function scrollLeftDistance(container, flag) {
  let scrollLeft = flag ? container.scrollLeft : container.offsetLeft;
  if (container.tagName.toLowerCase() == "body") {
    scrollLeft = scrollLeft || document.documentElement.scrollLeft;
  }
  return scrollLeft;
}
function scrollStep(timestamp) {
  // 暂时只考虑了父盒子有滚动条，目标盒子为父盒子的直接子盒子，需要考虑嵌套情况
  if (scrollto.abort) return;
  if (!scrollto.timestart) scrollto.timestart = timestamp;
  let progress = easeInOutCubic(
    (timestamp - scrollto.timestart) / scrollto.options.during
  ).toFixed(2);
  // console.log(progress);
  move(
    scrollto.container,
    scrollto.initialY + (scrollto.targetY - scrollto.initialY) * progress,
    scrollto.initialX + (scrollto.targetX - scrollto.initialX) * progress
  );
  // timestamp - scrollto.timestart < scrollto.options.during
  //   ? window.requestAnimationFrame(scrollStep)
  //   : done();
  (timestamp - scrollto.timestart) / scrollto.options.during < 1
    ? window.requestAnimationFrame(scrollStep)
    : done();
}
function move(element, top, left) {
  if (scrollto.options.direction == "y") element.scrollTop = top;
  if (scrollto.options.direction == "x") element.scrollLeft = left;
  if (element.tagName.toLowerCase() === "body") {
    // in firefox body.scrollTop doesn't scroll the page
    // thus if we are trying to scrollTop on a body tag
    // we need to scroll on the documentElement
    if (scrollto.options.direction == "y")
      document.documentElement.scrollTop = top;
    if (scrollto.options.direction == "x")
      document.documentElement.scrollLeft = left;
  }
}
function done() {
  scrollto.container.scrollTop = scrollto.targetY;
  // console.log(scrollto.target.scrollTop);
  scrollto.abort = true;
}
export default scrollto;
