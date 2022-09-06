<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, nextTick } from "vue";

export default defineComponent({
  props: {
    event: {},
    item: {},
    index: {},
  },
  mounted() {
    nextTick(() => {
      console.log(this.$el.offsetHeight);
      const width = this.$el.offsetWidth;
      const height = this.$el.offsetHeight;
    });
  },
});
</script>
