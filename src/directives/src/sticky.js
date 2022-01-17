let listenAction;
const vueSticky = {
  name: "vue-sticky",
  inserted(el, binding) {
    const params = binding.value || {};
    const stickyTop = params.stickyTop || 0;
    const zIndex = params.zIndex || 1000;
    const elStyle = el.style;
    const container = document.querySelector(params.container) || window;
    elStyle.position = "-webkit-sticky";
    elStyle.position = "sticky";
    const elHeight = el.getBoundingClientRect().height;
    const elWidth = el.getBoundingClientRect().width;
    elStyle.cssText = `top: ${stickyTop}px; z-index: ${zIndex}`;

    const parentElm = el.parentNode || document.documentElement;
    const placeholder = document.createElement("div"); // sticky元素在滚动到之后会脱离文档流，需要一个元素来占位
    placeholder.style.display = "none";
    placeholder.style.width = `${elWidth}px`;
    placeholder.style.height = `${elHeight}px`;
    parentElm.insertBefore(placeholder, el);

    let active = false;

    const getScroll = (target, top) => {
      const prop = top ? "pageYOffset" : "pageXOffset";
      const method = top ? "scrollTop" : "scrollLeft";
      let ret = target[prop];
      if (typeof ret !== "number") {
        ret = window.document.documentElement[method];
      }
      return ret;
    };

    const sticky = () => {
      console.log(active);
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
      if (!active) {
        return;
      }
      elStyle.position = "";
      placeholder.style.display = "none";
      active = false;
    };

    const check = () => {
      const scrollTop = getScroll(window, true);
      const offsetTop = el.getBoundingClientRect().top;
      if (offsetTop < stickyTop) {
        sticky();
      } else {
        if (scrollTop < elHeight + stickyTop) {
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
    this.container.removeEventListener("scroll", listenAction);
  },
};

export default vueSticky;
