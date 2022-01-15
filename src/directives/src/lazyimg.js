const lazyLoad = {
  name: "lazy-img",
  //   inserted: function (el, binding) {
  //   },
  bind(el, binding) {
    const defaultUrl = binding.value.defaultUrl || "";
    lazyLoad.init(el, binding.value.url, defaultUrl);
  },
  inserted(el) {
    if (IntersectionObserver) {
      lazyLoad.observe(el);
    } else {
      lazyLoad.listenScroll(el);
    }
  },
  // inserted(el) {},
  init(el, url, defaultUrl) {
    el.setAttribute("data-src", url);
    el.setAttribute("src", defaultUrl);
  },
  observe(el) {
    var io = new IntersectionObserver((entries) => {
      const realSrc = el.dataset.src;
      if (entries[0].isIntersecting) {
        if (realSrc) {
          el.src = realSrc;
          el.removeAttribute("data-src");
        }
      }
    });
    io.observe(el);
  },
  listenScroll(el) {
    const handler = lazyLoad.throttle(lazyLoad.laodImgByScroll, 600);
    lazyLoad.laodImgByScroll(el); // 此处参数不能直接加在laodImgByScroll后，因为那样就不是函数，而是直接调用
    window.addEventListener("scroll", () => {
      handler(el);
    });
  },
  laodImgByScroll(el) {
    const windowsHeight = document.documentElement.clientHeight;
    const elTop = el.getBoundingClientRect().top;
    const elBottom = el.getBoundingClientRect().bottom;
    const realSrc = el.dataset.src;
    if (realSrc && elTop - windowsHeight < 0 && elBottom > 0) {
      el.src = realSrc;
      el.removeAttribute("data-src");
    }
  },
  throttle(fun, wait) {
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
  },
};
export default lazyLoad;
