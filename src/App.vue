<template>
  <div id="app">
    <div class="test-box">
      <st-todolist></st-todolist>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  .test-box {
    width: 500px;
    height: 700px;
    border: 1px solid #999;
  }
}
</style>
