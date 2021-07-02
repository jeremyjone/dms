import { RoutePoint } from ".";
import { RoutePath } from "./path";
import AdminPage from "../pages/AdminPage.vue";

export type AdminRoutePathType = "index" | "dashboard" | "analysis" | "manage";

const ADMIN = RoutePath.admin;
export const AdminRoutePath: Record<AdminRoutePathType, string> = {
  index: ADMIN,
  dashboard: `${ADMIN}/dashboard`,
  analysis: `${ADMIN}/analysis`,
  manage: `${ADMIN}/manage`
};

const META = (title?: string) => {
  return { requireAuth: true, roles: "system.show", title };
};

export const AdminMenus: RoutePoint[] = [
  {
    path: AdminRoutePath.dashboard,
    name: "AdminDashboard",
    text: "仪表盘",
    meta: META,
    component: () => import("@/pages/BlankPage.vue"),
    redirect: `${AdminRoutePath.dashboard}/workplace`,
    children: [
      {
        path: `${AdminRoutePath.dashboard}/workplace`,
        name: "AdminWorkplace",
        text: "工作台",
        meta: META("工作台"),
        component: () =>
          import(
            /* webpackChunkName: "workplace" */ "@/views/admin/dashboard/Workplace.vue"
          )
      },
      {
        path: `${AdminRoutePath.dashboard}/*`,
        name: "AdminDashboard404",
        redirect: `${AdminRoutePath.dashboard}/workplace`
      }
    ]
  },
  {
    path: AdminRoutePath.analysis,
    name: "AdminAnalysis",
    text: "分析中心",
    meta: META,
    component: () => import("@/pages/BlankPage.vue"),
    children: [
      {
        path: `${AdminRoutePath.analysis}/index`,
        name: "AdminAnalysisData",
        text: "资料分析",
        meta: META("资料分析"),
        component: () =>
          import(
            /* webpackChunkName: "analysis" */ "@/views/admin/analysis/index.vue"
          )
      },
      {
        path: `${AdminRoutePath.analysis}/*`,
        name: "AdminAnalysis404",
        redirect: AdminRoutePath.analysis
      }
    ] as RoutePoint[]
  },
  {
    path: AdminRoutePath.manage,
    name: "AdminManage",
    text: "管理",
    meta: META,
    component: () => import("@/pages/BlankPage.vue"),
    redirect: `${AdminRoutePath.manage}/user`,
    children: [
      {
        path: `${AdminRoutePath.manage}/user`,
        name: "AdminManageUser",
        text: "管理成员",
        meta: META("管理成员"),
        component: () =>
          import(
            /* webpackChunkName: "manageuser" */ "@/views/admin/manage/User.vue"
          )
      },
      {
        path: `${AdminRoutePath.manage}/role`,
        name: "AdminManageRole",
        text: "管理权限",
        meta: META("管理权限"),
        component: () =>
          import(
            /* webpackChunkName: "managerole" */ "@/views/admin/manage/Role.vue"
          )
      },
      {
        path: `${AdminRoutePath.manage}/*`,
        name: "AdminManage404",
        redirect: `${AdminRoutePath.manage}/user`
      }
    ]
  }
];

// router
export const AdminMenuRoutes: RoutePoint = {
  path: AdminRoutePath.index,
  name: "Admin",
  meta: {
    requireAuth: true,
    roles: "system.show"
  },
  component: AdminPage,
  redirect: AdminRoutePath.dashboard,
  children: AdminMenus.concat([
    {
      path: `${AdminRoutePath.index}/*`,
      name: "AdminDefault",
      meta: { requireAuth: true, roles: "system.show" },
      redirect: AdminRoutePath.dashboard
    }
  ])
};
