<template>
  <div ref="rootNode" :style="warpStyle">
    <div ref="innerNode" :style="innerStyle" v-if="!modelFlag">
      <div
        v-for="(item, i) in event?.items"
        :key="i"
        :style="getItemStyle(i)"
        class="vue3-infinite-list"
        ref="items"
      >
        <slot :event="event" :item="item.item" :index="i"></slot>
      </div>
    </div>
    <div v-else class="actualContent" :style="innerStyle" ref="innerNode">
      <div
        class="infinite-list-item"
        ref="items"
        :id="item._id"
        :key="item._id"
        v-for="(item, index) in visibleData"
      >
        <slot ref="slot" :item="item.item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUpdated,
  toRefs,
  reactive,
  computed,
  nextTick,
} from "vue";
import { addEventListener } from "../../utils";
import { SizeAndPosManager } from "./SizeAndPosManager";
import ScrollFlex from "./ScrollFlex.vue";
import {
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  positionProp,
  STYLE_WRAPPER,
  STYLE_INNER,
  STYLE_INNER_FLEX,
  STYLE_ITEM,
  scrollProp,
  sizeProp,
} from "./constants";
interface ItemStyle {
  position: "absolute";
  top?: number;
  left: number;
  width: string | number;
  height?: number;
}
interface StyleCache {
  [id: number]: ItemStyle;
}
export default defineComponent({
  name: "InfiniteScroll",
  props: {
    scrollData: {
      type: Array || null,
      default: [],
    },
    data: {
      type: Array || null,
      default: [],
      required: true,
    },
    // itemsize为单条的高度考虑后续存在不同高度的item，这个就不传了通过计算得到
    // 也可以保留用作固定高度时候的高效渲染
    itemSize: {
      type: null,
      required: true,
    },
    // 滚动方向
    scrollDirection: {
      type: String,
      default: DIRECTION_VERTICAL,
    },
    // 预估渲染 传入该值则开始自适应高度的模式，但性能不好
    estimatedItemSize: {
      type: Number || null,
      default: null,
    },
    // 缓冲区大小
    overscanCount: {
      type: Number,
      default: 4,
    },
    // 视口的高度
    height: {
      type: [Number, String],
    },
    width: {},
  },
  components: {
    ScrollFlex,
  },
  setup(props) {
    let rootNode = ref(null);
    let innerNode = ref(null);
    let warpStyle = ref(null);
    let innerStyle = ref(null);
    let items: any = ref(null);

    let offset: number;
    let styleCache: StyleCache = {};
    let visableItems: any[] = reactive([]); // 显示的元素
    let sizeAndPosManager: SizeAndPosManager; // 位置管理模块
    let startIndex: any = ref(0);
    let endIndex: any = ref(6);
    let _positionData = computed(() => {
      return props.data.map((item, index) => {
        return {
          item,
          _id: index,
        };
      });
    }); // 存放处理后的数据，需要跟之前的隔离以免影响到
    let visibleData = computed(() => {
      let start =
        startIndex.value - props.overscanCount < 0
          ? 0
          : startIndex.value - props.overscanCount;
      let end = endIndex.value + props.overscanCount;
      return _positionData.value.slice(start, end);
    });
    let positions: any;
    positions = props.data.map((d, index) => ({
      index,
      height: props.estimatedItemSize,
      top: index * props.estimatedItemSize,
      bottom: (index + 1) * props.estimatedItemSize,
    }));
    // 为true则是自适应模式
    let modelFlag = computed(
      () =>
        typeof props.estimatedItemSize === "number" &&
        props.estimatedItemSize >= 0
    );
    const event = reactive({} as any);
    const { itemSize, scrollDirection } = toRefs(props);
    const getCurrSizeProp = () => {
      return sizeProp[scrollDirection.value];
    };

    const getCurrSizeVal = () => {
      return (props as any)[getCurrSizeProp()];
    };
    const getItemCount = (): number => {
      return props.data ? props.data.length : 0;
    };
    const getSize = (index: number): number => {
      if (typeof itemSize.value === "function") {
        return itemSize.value(index);
      }
      return Array.isArray(itemSize.value)
        ? itemSize.value[index]
        : itemSize.value;
    };
    const getNodeOffset = () => {
      return (rootNode.value as any)["scrollTop"];
    };
    const createSizeAndPosManager = () => {
      if (!sizeAndPosManager)
        sizeAndPosManager = new SizeAndPosManager({
          itemCount: getItemCount(),
          itemSizeGetter: (index) => getSize(index),
          estimatedItemSize: getEstimatedItemSize(),
        });
      sizeAndPosManager.initCachedPositions();
      return sizeAndPosManager;
    };
    const getEstimatedItemSize = () => {
      return (
        props.estimatedItemSize ||
        (typeof itemSize.value === "number" && itemSize.value) ||
        50
      );
    };
    const initScroll = () => {
      createSizeAndPosManager(); // 先初始化预估的位置和数量
      addEventListener(rootNode.value as any, "scroll", handleScroll);
      // offset =
      //   props.scrollOffset ||
      //   (props.scrollToIndex != null &&
      //     getOffsetForIndex(props.scrollToIndex)) ||
      //   0;
      setDomStyle();
      scrollRender();
    };
    const handleScroll = (e: UIEvent) => {
      //当前滚动位置
      let scrollTop = (rootNode.value as any).scrollTop;
      // let startBottom = this.positions[this.start - ]
      //此时的开始索引
      startIndex.value = getStartIndex(scrollTop);
      //此时的结束索引
      endIndex.value = startIndex.value + 6;
      //此时的偏移量
      setStartOffset();

      // const nodeOffset = getNodeOffset();
      // if (
      //   nodeOffset < 0 ||
      //   offset === nodeOffset ||
      //   e.target !== rootNode.value
      // )
      //   return;

      // offset = nodeOffset;

      // scrollRender();
    };
    const setDomStyle = () => {
      // 常规定高模式下，内部相对定位，通过计算给出总高以模拟出滚动条，当发生滚动的时候，内部盒子正常滚动，只不过程序控制的是里面绝对定位item的渲染
      warpStyle.value = {
        ...STYLE_WRAPPER,
        height: props.height + "px",
        width: props.width,
      };
      // 自适应高度的情况下，innerStyle应该为绝对定位，内部子元素相对定位，并高度自由撑开，给定的预估高度为min-height
      if (modelFlag) {
        innerStyle.value = {
          ...STYLE_INNER_FLEX,
          [getCurrSizeProp()]: sizeAndPosManager.getTotalSize() + "px",
        };
      } else {
        innerStyle.value = {
          ...STYLE_INNER,
          [getCurrSizeProp()]: sizeAndPosManager.getTotalSize() + "px",
        };
      }
    };
    const getItemStyle = (index: number): any => {
      index += event.start;
      const style = styleCache[index];
      if (style) return style;

      const { size, offset } =
        sizeAndPosManager.getSizeAndPositionForIndex(index);

      return (styleCache[index] = {
        ...STYLE_ITEM,
        [getCurrSizeProp()]: size + "px",
        [(positionProp as any)[props.scrollDirection]]: offset + "px",
      });
    };
    const getTransform = () => {
      return `translate3d(0,${
        startIndex >= 1
          ? sizeAndPosManager.cachedPositions[startIndex - 1].bottom
          : 0
      }px,0)`;
    };
    const scrollRender = () => {
      const { start, stop } = sizeAndPosManager.getVisibleRange({
        containerSize: getCurrSizeVal() || 0,
        offset: offset || 0,
        overscanCount: props.overscanCount,
      });
      console.log(start, stop, offset, "+++++++++++++");

      if (typeof start !== "undefined" && typeof stop !== "undefined") {
        visableItems.length = 0;

        for (let i = start; i <= stop; i++) {
          visableItems.push(_positionData.value[i]);
        }
        event.start = start;
        event.stop = stop;
        event.offset = offset;
        event.items = visableItems;
        event.total = getItemCount();
      }
    };
    const updateItemsSize = () => {
      if (!items.value || !items.value.length) {
        return;
      }
      items.value.forEach((node: any) => {
        let rect = node.getBoundingClientRect();
        let height = rect.height;
        let index = +node.id.slice(1);
        let oldHeight = positions[index].height;
        let dValue = oldHeight - height;
        //存在差值
        if (dValue) {
          positions[index].bottom = positions[index].bottom - dValue;
          positions[index].height = height;
          for (let k = index + 1; k < positions.length; k++) {
            positions[k].top = positions[k - 1].bottom;
            positions[k].bottom = positions[k].bottom - dValue;
          }
        }
      });
    };
    const getStartIndex = (scrollTop = 0) => {
      //二分法查找
      return binarySearch(positions, scrollTop);
    };
    const binarySearch = (list: any, value: number) => {
      let start = 0;
      let end = list.length - 1;
      let tempIndex = null;

      while (start <= end) {
        let midIndex = Math.floor((start + end) / 2);
        let midValue = list[midIndex].bottom;
        if (midValue === value) {
          return midIndex + 1;
        } else if (midValue < value) {
          start = midIndex + 1;
        } else if (midValue > value) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex;
          }
          end = end - 1;
        }
      }
      return tempIndex;
    };
    const setStartOffset = () => {
      let startOffset;
      if (startIndex.value >= 1) {
        let size =
          positions[startIndex.value].top -
          (positions[startIndex.value - 0]
            ? positions[startIndex.value - 0].top
            : 0);
        startOffset = positions[startIndex.value - 0].bottom - size;
      } else {
        startOffset = 0;
      }
      (
        innerNode.value as any
      ).style.transform = `translate3d(0,${startOffset}px,0)`;
    };
    onMounted(() => setTimeout(initScroll));
    onUpdated(() => {
      if (!modelFlag.value) return;
      nextTick(function () {
        //获取真实元素大小，修改对应的尺寸缓存
        updateItemsSize();
        //更新列表总高度
        let height = positions[positions.length - 1].bottom;
        // this.$refs.phantom.style.height = height + "px";
        //更新真实偏移量
        setStartOffset();
      });
      // nextTick(() => {
      //   if (!items.value || !items.value.length) {
      //     return;
      //   }
      //   //获取真实元素大小，修改对应的尺寸缓存
      //   items.value.forEach((node: any) => {
      //     let rect = node.getBoundingClientRect();
      //     let height = rect.height;
      //     let index = +node.id.slice(1);
      //     let oldHeight = positions[index].height;
      //     let dValue = oldHeight - height;
      //     //存在差值
      //     if (dValue) {
      //       positions[index].bottom = positions[index].bottom - dValue;
      //       positions[index].height = height;
      //       for (let k = index + 1; k < positions.length; k++) {
      //         positions[k].top = positions[k - 1].bottom;
      //         positions[k].bottom = positions[k].bottom - dValue;
      //       }
      //     }
      //   });
      //   //更新列表总高度
      //   let height = positions[positions.length - 1].bottom;
      //   // this.$refs.phantom.style.height = height + "px";
      //   //更新真实偏移量
      //   // this.setStartOffset();
      // });
    });

    return {
      rootNode,
      innerNode,
      warpStyle,
      innerStyle,
      event,
      getItemStyle,
      items,
      modelFlag,
      visibleData,
    };
  },
});
</script>
<style lang="scss" scoped>
.actualContent .vue3-infinite-list {
  border-bottom: 1px solid #999;
}
</style>
