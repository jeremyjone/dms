type StorageKeys =
  | "re"
  | "role"
  | "group"
  | "time"
  | "token"
  | "userId"
  | "nickname"
  | "username"
  | "color"
  | "dark"
  | "lang"
  | "asShow"
  | "asShowConfig"
  | "asShowIconSize";

export const vars = {
  keys: {
    re: "re",
    role: "role",
    group: "group",
    time: "time",
    token: "token",
    userId: "user_id",
    nickname: "nickname",
    username: "username",
    color: "color",
    dark: "dark",
    lang: "lang",
    asShow: "as_show",
    asShowConfig: "as_show_config",
    asShowIconSize: "as_show_icon_size"
  } as { [key in StorageKeys]: string }
};

export interface Vars {
  keys: {
    [key in StorageKeys]: string;
  };
}
