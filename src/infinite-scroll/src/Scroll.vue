<template>
  <div
    ref="rootNode"
    :style="warpStyle"
    style="height: 300px; overflow-y: auto"
  >
    <div ref="innerNode" :style="innerStyle" style="height: 400px">
      <div
        v-for="(item, i) in event?.items"
        :style="getItemStyle(i)"
        :key="event?.start + i"
        class="vue3-infinite-list"
      >
        <slot :event="event" :item="item" :index="event.start + i"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { addEventListener } from "../../utils";

export default defineComponent({
  name: "InfiniteScroll",
  props: {
    scrollData: {
      type: Array || null,
      default: [],
    },
  },
  setup() {
    let rootNode = ref(null);
    let innerNode = ref(null);
    let warpStyle = ref(null);
    let innerStyle = ref(null);

    const initScroll = () => {
      addEventListener(rootNode.value as any, "scroll", handleScroll);
    };
    const handleScroll = (e: UIEvent) => {
      //   const nodeOffset = getNodeOffset();
      //   if (
      //     nodeOffset < 0 ||
      //     offset === nodeOffset ||
      //     e.target !== rootNode.value
      //   )
      //     return;

      //   offset = nodeOffset;
      //   scrollChangeReason = SCROLL_CHANGE_OBSERVED;
      //   scrollRender();
      console.log(9999);
    };
    onMounted(() => setTimeout(initScroll));
    return { rootNode, innerNode, warpStyle, innerStyle };
  },
});
</script>
