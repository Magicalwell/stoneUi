const methods = {
  typeOf(obj) {
    const { toString } = Object.prototype;
    const map = {
      "[object Boolean]": "boolean",
      "[object Number]": "number",
      "[object String]": "string",
      "[object Function]": "function",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object RegExp]": "regExp",
      "[object Undefined]": "undefined",
      "[object Null]": "null",
      "[object Object]": "object",
      "[object Map]": "map",
      "[object Set]": "set",
    };
    return map[toString.call(obj)];
  },
  isFunction(obj) {
    return this.typeOf(obj) === "function";
  },
  isPlainObject(obj) {
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var proto, Ctor;
    if (!obj || toString.call(obj) !== "[object Object]") {
      return false;
    }
    proto = Object.getPrototypeOf(obj);
    if (!proto) {
      return true;
    }
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return (
      typeof Ctor === "function" &&
      hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object)
    );
  },
  extend() {
    // 默认不进行深拷贝
    var deep = false;
    var name, options, src, copy, clone, copyIsArray;
    var length = arguments.length;
    var i = 1;
    // 第一个参数不传布尔值的情况下，target 默认是第一个参数
    var target = arguments[0] || {};
    // 如果第一个参数是布尔值，第二个参数是 target
    if (typeof target == "boolean") {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== "object" && !this.isFunction(target)) {
      target = {};
    }

    // 循环遍历要复制的对象们
    for (; i < length; i++) {
      // 获取当前对象
      options = arguments[i];
      // 要求不能为空 避免 extend(a,,b) 这种情况
      if (options != null) {
        for (name in options) {
          // 目标属性值
          src = target[name];
          // 要复制的对象的属性值
          copy = options[name];

          // 解决循环引用
          if (target === copy) {
            continue;
          }
          if (
            deep &&
            copy &&
            (this.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
          ) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && this.isPlainObject(src) ? src : {};
            }

            target[name] = this.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    return target;
  },
};

export default methods;
