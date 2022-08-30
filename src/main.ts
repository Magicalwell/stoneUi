import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import stoneUi from "./index";

const app = createApp(App);
app.use(store).use(stoneUi).mount("#app");
