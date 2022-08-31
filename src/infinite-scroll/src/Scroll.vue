<template>
  <div ref="rootNode" :style="warpStyle">
    <div ref="innerNode" :style="innerStyle">
      <div
        v-for="(item, i) in event?.items"
        :key="i"
        :style="getItemStyle(i)"
        class="vue3-infinite-list"
      >
        <slot :event="event" :item="item" :index="i"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, toRefs, reactive } from "vue";
import { addEventListener } from "../../utils";
import { SizeAndPosManager } from "./SizeAndPosManager";
import {
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  positionProp,
  STYLE_WRAPPER,
  STYLE_INNER,
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
    // itemsize考虑后续不传，通过计算得到
    itemSize: {
      type: null,
      required: true,
    },
    scrollDirection: {
      type: String,
      default: DIRECTION_VERTICAL,
    },
    estimatedItemSize: {
      type: Number || null,
    },
    overscanCount: {
      type: Number,
      default: 4,
    },
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

    let offset: number;
    let styleCache: StyleCache = {};
    let visableItems: any[] = reactive([]);
    let sizeAndPosManager: SizeAndPosManager;
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
      warpStyle.value = {
        ...STYLE_WRAPPER,
        height: props.height + "px",
        width: props.width,
      };

      innerStyle.value = {
        ...STYLE_INNER,
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
      console.log(start, stop);
      if (typeof start !== "undefined" && typeof stop !== "undefined") {
        visableItems.length = 0;

        for (let i = start; i <= stop; i++) {
          console.log(props.data[i]);

          visableItems.push(props.data[i]);
        }
        console.log(visableItems);

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
    return { rootNode, innerNode, warpStyle, innerStyle, event, getItemStyle };
  },
});
</script>
