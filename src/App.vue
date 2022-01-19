<template>
  <div
    id="app"
    v-water-mark="{
      text: '3srstudio.cc',
      textColor: 'rgba(180, 180, 180, 0.4)',
    }"
  >
    <div class="test-box">
      <button v-debounce="[testdebounced]" ref="testbottom" id="testbottom">
        999
      </button>
      <input type="text" v-throttle="[inputest, 'input', 1000]" />
      <st-todolist></st-todolist>
      <div class="test" id="test222">909909321</div>
      <div class="test" id="test">909909321</div>
      <div class="test" id="test">909909321</div>
      <div class="test" id="test">909909321</div>
      <div class="test" id="test">909909321</div>
      <div class="test" id="test">909909321</div>
      <div class="test" id="test">909909321</div>
      <div class="test" id="test">909909321</div>
      <div class="test" id="test">909909321</div>
      <div
        class="test2"
        id="test2"
        v-vue-sticky="{ container: '#app', stickyTop: 150 }"
      >
        测试测试
      </div>
      <img
        v-lazy-img="{
          url: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed44c6756d7b4c4989e9623baad731b9~tplv-k3u1fbpfcp-image.image',
          options: { a: 1 },
        }"
        alt=""
        style="width: 100px; height: 100px; margin-top: 600px"
      />
      <hr />
      <div
        v-scroll-to="{
          container: '#app',
          el: '#test222',
          direction: 'y',
          during: 300,
          node: $refs.testbottom,
        }"
      >
        test
      </div>
      <div>{{ 2 | channelFilter }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      obj1: { a: 1, b: { c: 2 } },
      obj2: { b: { c: [5] } },
    };
  },
  methods: {
    testdebounced() {
      console.log(1111111111);
      console.log(this.$stMethods.extend(true, this.obj1, this.obj2));
      console.log(
        this.$stMethods.flatten([1, 2, [5, 6, 7, [9, 10]]], false, false)
      );
    },
    inputest() {
      console.log(999);
    },
  },
  computed: {
    testnode() {
      return this.$refs.testbottom;
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 600px;
  overflow: auto;
  .test-box {
    width: 500px;
    height: 1200px;
    border: 1px solid #999;
    overflow: auto;
  }
}
</style>
