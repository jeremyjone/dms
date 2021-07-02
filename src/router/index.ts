import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomePage from "../pages/HomePage.vue";

import { RoutePath, RoutePathType } from "./path";
import { AdminMenuRoutes } from "./admin";
import { Loading } from "quasar";
import store from "@/store";
import { utils } from "@/utils";
import { toast } from "@/components";
import { TITLE } from "@/config/init";

Vue.use(VueRouter);

export type RoutePoint = RouteConfig & {
  text?: string;
  children?: RoutePoint[];
  icon?: string;
};

const routes: Array<RoutePoint> = [
  {
    path: RoutePath.home,
    name: "Home",
    meta: {
      requireAuth: true
    },
    component: HomePage,
    children: [
      {
        path: RoutePath.library,
        name: "Home",
        meta: {
          requireAuth: true,
          title: "资料库"
        },
        component: () =>
          import(/* webpackChunkName: "library" */ "../pages/Library.vue")
      },
      {
        path: RoutePath.data,
        name: "Data",
        meta: {
          requireAuth: true,
          title: "资料"
        },
        component: () =>
          import(/* webpackChunkName: "data" */ "../pages/Data.vue")
      },
      {
        path: "/",
        name: "Index",
        redirect: RoutePath.library
      }
    ]
  },

  AdminMenuRoutes,

  {
    path: RoutePath.login,
    name: "Login",
    meta: {
      title: "登录"
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../pages/Login.vue")
  },
  {
    path: RoutePath.logout,
    name: "Logout",
    redirect: "/login"
  },
  {
    path: "/callback",
    name: "CallBack",
    component: () =>
      import(/* webpackChunkName: "callback" */ "../pages/CallBack.vue")
  },
  {
    path: "*",
    name: "NotFound",
    meta: {
      title: "404"
    },
    component: () =>
      import(/* webpackChunkName: "notFound" */ "../pages/NotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  Loading.show();

  if (!store.state.user.token) {
    await store.dispatch("ReloadInfo");
  }

  // 设置 title
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${TITLE}`;
  } else {
    document.title = TITLE;
  }

  // 如果没有 token，直接返回登录界面
  if (store.state.user.token) {
    // 权限不应该为空。如果没有，重新获取
    if (store.state.user.role?.length === 0) {
      await store.dispatch("SetUserRole");
    }

    // 路由需要验证
    if (to.meta.requireAuth) {
      // 从登录进入的，检查是否包含重定向路径
      if (from.path === RoutePath.login) {
        const redirect = decodeURIComponent(
          (from.query.redirect as string) || to.fullPath
        );
        if (to.fullPath === redirect) {
          next();
        } else {
          // 跳转到目的路由
          next({ path: redirect });
        }
      }

      // 首页
      if (to.path === RoutePath.home) {
        next();
      } else {
        // 页面权限，全局权限判断，没有权限跳转到首页
        const role = to.meta?.roles ? utils.hasRole(to.meta.roles) : true;
        role ? next() : next({ path: RoutePath.home });
      }
    } else {
      // 忽略不可跳转的页面
      const ignoreList = [RoutePath.login, RoutePath.logout];
      if (ignoreList.includes(to.path)) {
        next({ path: RoutePath.home });
        toast('如需退出，请点击 "个人" -> "登出" 按钮。', "info");
      } else {
        next();
      }
    }
  } else {
    if ([RoutePath.login, RoutePath.logout, "/callback"].includes(to.path)) {
      next();
    } else {
        next({ path: RoutePath.login, query: { redirect: to.fullPath } });
    }
  }
});

router.afterEach(() => {
  Loading.hide();
});

export default router;
export { RoutePath, RoutePathType };
