let listenAction;
let container;
const vueSticky = {
  name: "vue-sticky", // 此指令还不太完善 还需要考虑吸附对象是谁 如果在一个有滚动条的div中，是以这个div为基准吸附还是以window
  inserted(el, binding) {
    const params = binding.value || {};
    const stickyTop = params.stickyTop || 0;
    const zIndex = params.zIndex || 1000;
    const elStyle = el.style;
    container = document.querySelector(params.container) || window;
    elStyle.position = "-webkit-sticky";
    elStyle.position = "sticky";
    const elHeight = el.getBoundingClientRect().height;
    const elWidth = el.getBoundingClientRect().width;
    const elTop = el.getBoundingClientRect().top;
    elStyle.cssText = `top: ${stickyTop}px; z-index: ${zIndex}`;
    console.log(el.style);
    const parentElm = el.parentNode || document.documentElement;
    const placeholder = document.createElement("div"); // sticky元素在滚动到之后会脱离文档流，需要一个元素来占位
    placeholder.style.display = "none";
    placeholder.style.width = `${elWidth}px`;
    placeholder.style.height = `${elHeight}px`;
    parentElm.insertBefore(placeholder, el);

    let active = false;

    const getScroll = (target, top) => {
      // const prop = top ? "pageYOffset" : "pageXOffset";
      const method = top ? "scrollTop" : "scrollLeft";
      let ret = target[method];
      if (typeof ret !== "number" || !target) {
        ret = window.document.documentElement[method];
      }
      return ret;
    };

    const sticky = () => {
      if (active) {
        return;
      }
      if (!elStyle.height) {
        elStyle.height = `${el.offsetHeight}px`;
      }
      elStyle.position = "fixed";
      elStyle.width = `${elWidth}px`;
      placeholder.style.display = "inline-block";
      active = true;
    };

    const reset = () => {
      console.log("重置");
      if (!active) {
        return;
      }
      elStyle.position = "";
      placeholder.style.display = "none";
      active = false;
    };

    const check = () => {
      const scrollTop = getScroll(container, true);
      const offsetTop = el.getBoundingClientRect().top;
      console.log(offsetTop);
      if (offsetTop < stickyTop) {
        console.log(999);
        sticky();
      } else {
        console.log(scrollTop, elHeight, stickyTop, elTop);
        if (scrollTop + stickyTop < elTop) {
          reset();
        }
      }
    };
    listenAction = () => {
      check();
    };

    container.addEventListener("scroll", listenAction); // 不断监听，如果scrolltop<el.top 即为原来位置出现在了窗口中，是不能够浮动了
  },

  unbind() {
    // const container = document.querySelector(params.container) || window; //热更新情况下，需要在这里面重新引入el和binding 否则取不到container
    container.removeEventListener("scroll", listenAction);
  },
};
export default vueSticky;
