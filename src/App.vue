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
      <div class="test" id="test">909909321</div>
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
          el: '#test',
          direction: 'y',
          during: 300,
          node: $refs.testbottom,
        }"
      >
        test
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    testdebounced() {
      console.log(1111111111);
      console.log(this.$refs.testbottom);
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
