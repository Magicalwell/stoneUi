<template>
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  <STInfiniteScroll
    :data="data"
    :width="'100%'"
    :height="500"
    :itemSize="50"
    :estimatedItemSize="50"
    v-slot="{ item }"
  >
    <div>{{ item.title}}</div>
  </STInfiniteScroll>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import CommonService from "./infinite-scroll/src/common.service";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
  },
  setup() {
    const data = CommonService.generateData(1000);
    return {
      data,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
