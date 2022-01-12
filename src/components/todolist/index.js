import todoList from "./src/todolist.vue";

/* istanbul ignore next */
todoList.install = function (Vue) {
  Vue.component(todoList.name, todoList);
};

export default todoList;
