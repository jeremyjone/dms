export type RoutePathType =
  | "home"
  | "login"
  | "logout"
  | "library"
  | "data"
  | "profile"
  | "admin";

export const RoutePath: Record<RoutePathType, string> = {
  home: "/",
  login: "/login",
  logout: "/logout",
  library: "/library",
  data: "/data",
  profile: "/profile",
  admin: "/admin"
};
