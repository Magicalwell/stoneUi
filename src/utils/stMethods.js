const methods = {
  typeOf(obj) {
    const { toString } = Object.prototype;
    const typeMap = {
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
    return typeMap[toString.call(obj)];
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
    //对象合并
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
            (this.isPlainObject(copy) || (copyIsArray = Array.isArray(copy))) // 判断copy是否是嵌套对象或者数组
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
  deepCopy(obj) {
    // 深拷贝
    if (typeof obj !== "object") return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] =
          typeof obj[key] === "object" ? this.deepCopy(obj[key]) : obj[key];
      }
    }
    return newObj;
  },
  insertionSort(arr) {
    // 插入排序
    for (var i = 1; i < arr.length; i++) {
      var element = arr[i];
      for (var j = i - 1; j >= 0; j--) {
        var tmp = arr[j];
        var order = tmp - element;
        if (order > 0) {
          arr[j + 1] = tmp;
        } else {
          break;
        }
      }
      arr[j + 1] = element;
    }
    return arr;
  },
  quickSort(arr) {
    //快速排序
    // 交换元素
    function swap(arr, a, b) {
      var temp = arr[a];
      arr[a] = arr[b];
      arr[b] = temp;
    }

    function partition(arr, left, right) {
      var pivot = arr[left];
      var storeIndex = left;

      for (var i = left + 1; i <= right; i++) {
        if (arr[i] < pivot) {
          swap(arr, ++storeIndex, i);
        }
      }

      swap(arr, left, storeIndex);

      return storeIndex;
    }

    function sort(arr, left, right) {
      if (left < right) {
        var storeIndex = partition(arr, left, right);
        sort(arr, left, storeIndex - 1);
        sort(arr, storeIndex + 1, right);
      }
    }

    sort(arr, 0, arr.length - 1);

    return arr;
  },
  eq(a, b, aStack, bStack) {
    // === 结果为 true 的区别出 +0 和 -0
    if (a === b) return a !== 0 || 1 / a === 1 / b;

    // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
    if (a == null || b == null) return false;

    // 判断 NaN
    if (a !== a) return b !== b;

    // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
    var type = typeof a;
    if (type !== "function" && type !== "object" && typeof b != "object")
      return false;

    // 更复杂的对象使用 deepEq 函数进行深度比较
    return this.deepEq(a, b, aStack, bStack);
  },
  deepEq(a, b, aStack, bStack) {
    // a 和 b 的内部属性 [[class]] 相同时 返回 true
    var className = Object.prototype.toString.call(a);
    if (className !== Object.prototype.toString.call(b)) return false;

    switch (className) {
      case "[object RegExp]":
      case "[object String]":
        return "" + a === "" + b;
      case "[object Number]":
        if (+a !== +a) return +b !== +b;
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case "[object Date]":
      case "[object Boolean]":
        return +a === +b;
    }

    var areArrays = className === "[object Array]";
    // 不是数组
    if (!areArrays) {
      // 过滤掉两个函数的情况
      if (typeof a != "object" || typeof b != "object") return false;

      var aCtor = a.constructor,
        bCtor = b.constructor;
      // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
      if (
        aCtor == bCtor &&
        !(
          this.isFunction(aCtor) &&
          aCtor instanceof aCtor &&
          this.isFunction(bCtor) &&
          bCtor instanceof bCtor
        ) &&
        "constructor" in a &&
        "constructor" in b
      ) {
        return false;
      }
    }

    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;

    // 检查是否有循环引用的部分
    while (length--) {
      if (aStack[length] === a) {
        return bStack[length] === b;
      }
    }

    aStack.push(a);
    bStack.push(b);

    // 数组判断
    if (areArrays) {
      length = a.length;
      if (length !== b.length) return false;

      while (length--) {
        if (!this.eq(a[length], b[length], aStack, bStack)) return false;
      }
    }
    // 对象判断
    else {
      var keys = Object.keys(a),
        key;
      length = keys.length;

      if (Object.keys(b).length !== length) return false;
      while (length--) {
        key = keys[length];
        if (
          !(
            Object.prototype.hasOwnProperty.call(b, key) &&
            this.eq(a[key], b[key], aStack, bStack)
          )
        )
          return false;
      }
    }

    aStack.pop();
    bStack.pop();
    return true;
  },
  flatten(input, shallow, strict, output) {
    // 递归使用的时候会用到output
    output = output || [];
    var idx = output.length;

    for (var i = 0, len = input.length; i < len; i++) {
      var value = input[i];
      // 如果是数组，就进行处理
      if (Array.isArray(value)) {
        // 如果是只扁平一层，遍历该数组，依此填入 output
        if (shallow) {
          var j = 0;
          // len = value.length;
          len = value.length;
          while (j < len) output[idx++] = value[j++];
        }
        // 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output
        else {
          this.flatten(value, shallow, strict, output);
          idx = output.length;
        }
      }
      // 不是数组，根据 strict 的值判断是跳过不处理还是放入 output
      else if (!strict) {
        output[idx++] = value;
      }
    }
    // * shallow true + strict false ：正常扁平一层
    // * shallow false + strict false ：正常扁平所有层
    // * shallow true + strict true ：去掉非数组元素
    // * shallow false + strict true ： 返回一个[]
    return output;
  },
};

export default methods;
