<template>
  <div class="st-todolist-container">
    <div class="todolist-info">
      <div style="float: left">123213</div>
      <div class="title">待办清单</div>
      <div style="float: right">5132</div>
    </div>
    <div class="todolist-main">2</div>
    <div class="todolist-footer">3</div>
  </div>
</template>

<script>
export default {
  name: "StTodolist",
  props: {
    backgroundColor: {
      type: String,
      default: "#f2f5f7",
    },
    fontsize: {
      type: Number,
      default: 14,
    },
  },
};
</script>

<style lang="scss" scoped>
.st-todolist-container {
  background-color: #f2f5f7;
  font-size: 14px;
}
.todolist-info {
  height: 40px;
  width: 100%;
  .title {
    margin: 0 auto;
    text-align: center;
  }
}
</style>
