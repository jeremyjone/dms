import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { GetUser, Login } from "@/api/path/userApi";
import { UserLoginItem } from "@/models/user";
import { VRootState } from "@/store/types";
import { VUserState } from "./types";
import { Status } from "@/models/common";
import { toast } from "@/components";
import router, { RoutePath } from "@/router";
import { Loading, LocalStorage } from "quasar";
import { vars } from "@/utils/vars";

export const SET_USER_INFO = "set_user_info";
const SET_TOKEN = "set_token";
const SET_ROLE_INFO = "set_role_info";

const state: VUserState = {
  username: "",
  nickname: "",
  token: "",
  role: []
};

const getters: GetterTree<VUserState, VRootState> = {
  name: state => state.nickname || state.username || "unknown"
};

const mutations: MutationTree<VUserState> = {
  [SET_USER_INFO]: (state, info: UserLoginItem) => {
    state.nickname = info?.nickname ?? "";
    state.username = info?.username ?? "";
  },

  [SET_ROLE_INFO]: (state, info: UserLoginItem) => {
    state.role = info?.role?.permissions ?? [];
  },

  [SET_TOKEN]: (state, token: string) => {
    state.token = token;
  }
};

const actions: ActionTree<VUserState, VRootState> = {
  async Login(ctx, loginInfo: { username: string; password: string }) {
    Loading.show();

    const [err, res] = await Login(loginInfo);
    if (res && res.status === Status.OK) {
      // 成功
      ctx.dispatch("SetLoginInfo", res.data);
    } else {
      // 失败
      toast("登录失败，" + (err.data?.data ?? "unknown"), "error");
    }

    Loading.hide();
  },

  SetLoginInfo(ctx, info: UserLoginItem) {
    LocalStorage.set(vars.keys.username, info.username);
    LocalStorage.set(vars.keys.nickname, info.nickname);
    LocalStorage.set(vars.keys.userId, info.id);
    LocalStorage.set(vars.keys.token, info.token);
    ctx.commit(SET_USER_INFO, info);
    ctx.commit(SET_ROLE_INFO, info);
    ctx.commit(SET_TOKEN, info.token);

    router.push({ path: RoutePath.home }).catch(e => {
      // 捕获重定向异常
    });
    toast("欢迎回来，" + info.nickname, "success", "top");
  },

  Logout(ctx) {
    Loading.show();

    LocalStorage.remove(vars.keys.re);
    ctx.dispatch("ClearUserInfo");

    toast("再见！" + ctx.state.nickname, "success", "top");

    // 跳转到登录页面
    router.push({ path: RoutePath.logout }).catch(e => {
      // 捕获重定向异常
    });

    Loading.hide();
  },

  async SetUserRole(ctx) {
    const [err, res] = await GetUser();
    err && ctx.commit(SET_ROLE_INFO, {});
    if (res) {
      ctx.commit(SET_ROLE_INFO, res.data);
      ctx.commit(SET_USER_INFO, res.data);
    }
  },

  async ReloadInfo(ctx) {
    ctx.commit(SET_USER_INFO, {
      username: LocalStorage.getItem<string>(vars.keys.username),
      nickname: LocalStorage.getItem<string>(vars.keys.nickname)
    });
    ctx.commit(SET_TOKEN, LocalStorage.getItem<string>(vars.keys.token));
  },

  SetToken(ctx, token: string) {
    ctx.commit(SET_TOKEN, token);
    LocalStorage.set(vars.keys.token, token);
  },

  ClearUserInfo(ctx) {
    ctx.commit(SET_USER_INFO, {});
    ctx.commit(SET_TOKEN, "");
    LocalStorage.remove(vars.keys.token);
    LocalStorage.remove(vars.keys.userId);
  }
};

const user: Module<VUserState, VRootState> = {
  state,
  getters,
  actions,
  mutations
};

export default user;
