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
    <div v-else class="actualContent" :style="innerStyle">
      <div
        v-for="(item, i) in event?.items"
        :key="i"
        class="vue3-infinite-list"
        ref="items"
      >
        <slot :event="event" :item="item.item" :index="i"></slot>
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
  watch,
} from "vue";
import { addEventListener } from "../../utils";
import { SizeAndPosManager } from "./SizeAndPosManager";
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
  setup(props) {
    let rootNode = ref(null);
    let innerNode = ref(null);
    let warpStyle = ref(null);
    let innerStyle = ref(null);
    let items = ref(null);

    let offset: number;
    let styleCache: StyleCache = {};
    let visableItems: any[] = reactive([]); // 显示的元素
    let sizeAndPosManager: SizeAndPosManager; // 位置管理模块
    let _positionData = computed(() => {
      return props.data.map((item, index) => {
        return {
          item,
          _id: index,
        };
      });
    }); // 存放处理后的数据，需要跟之前的隔离以免影响到
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
      createSizeAndPosManager(); // 先初始化位置和数量
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
      const nodeOffset = getNodeOffset();
      if (
        nodeOffset < 0 ||
        offset === nodeOffset ||
        e.target !== rootNode.value
      )
        return;

      offset = nodeOffset;

      scrollRender();
    };
    const setDomStyle = () => {
      // 常规定高模式下，内部相对定位，通过计算给出总高以模拟出滚动条，当发生滚动的时候，内部盒子正常滚动，只不过程序控制的是里面绝对定位item的渲染
      warpStyle.value = {
        ...STYLE_WRAPPER,
        height: props.height + "px",
        width: props.width,
      };
      // 自适应高度的情况下，innerStyle应该为绝对定位，内部子元素相对定位，并高度自由撑开，给定的预估高度为min-height
      innerStyle.value = {
        ...(modelFlag ? STYLE_INNER_FLEX : STYLE_INNER),
        [getCurrSizeProp()]: sizeAndPosManager.getTotalSize() + "px",
      };
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
    const scrollRender = () => {
      const { start, stop } = sizeAndPosManager.getVisibleRange({
        containerSize: getCurrSizeVal() || 0,
        offset: offset || 0,
        overscanCount: props.overscanCount,
      });
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

        // if (!util.isPureNumber(itemSize.value)) {
        //   innerStyle.value = {
        //     ...STYLE_INNER,
        //     [getCurrSizeProp()]: addUnit(sizeAndPosManager.getTotalSize()),
        //   };
        // }
      }
    };
    onMounted(() => setTimeout(initScroll));
    onUpdated(() => {
      console.log(items.value);
      (items.value as any).forEach((element: HTMLElement) => {
        let rect = element.getBoundingClientRect();
        console.log(rect.height);
        
      });
    });
    // watch(
    //   () => props.data,
    //   (newVal, oldVal) => {
    //     sizeAndPosManager.updateConfig({
    //       itemCount: getItemCount(),
    //       estimatedItemSize: getEstimatedItemSize(),
    //     });
    //     oldOffset = null;
    //     recomputeSizes();
    //     setDomStyle();
    //     setTimeout(scrollRender, 0);
    //   }
    // );
    return {
      rootNode,
      innerNode,
      warpStyle,
      innerStyle,
      event,
      getItemStyle,
      items,
      modelFlag,
    };
  },
});
</script>
