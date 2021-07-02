import Vue from "vue";
import "animate.css/animate.min.css";
import VCharts from "v-charts";
import App from "./App.vue";
import router, { RoutePath } from "./router";
import store from "./store";
import "./quasar";

import { api } from "./api";
import { utils } from "./utils";
import { vars } from "./utils/vars";
import { toast, notice, viewer } from "@/components";
import { manager } from "./utils/extManager";

import { Init } from "./config/init";

Vue.use(VCharts);

Vue.config.productionTip = false;

Vue.prototype.$pw = {
  route: RoutePath,
  toast: toast,
  notice: notice,
  viewer: viewer,
  extManager: manager
};

Vue.prototype.$s = api;
Vue.prototype.$u = utils;
Vue.prototype.$v = vars;

new Vue({
  router,
  store,
  created: Init,
  render: h => h(App)
}).$mount("#app");
