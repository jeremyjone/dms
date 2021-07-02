import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import user from "./user";

import { VRootState } from "./types";

Vue.use(Vuex);

const store: StoreOptions<VRootState> = {
  modules: {
    user
  }
};

export default new Vuex.Store<VRootState>(store);
