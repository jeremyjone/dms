import { Dark, LocalStorage, Quasar } from "quasar";
import { printLogo } from "@/utils/print";
import { vars } from "@/utils/vars";
import { ThemeId } from "@/models/common";
import { utils } from "@/utils";
import { THEMES } from "./colors";

/* eslint-disable */
export const Init = async () => {
  // 设置 明亮/暗黑 模式
  Dark.set(LocalStorage.getItem(vars.keys.dark) ?? true);

  // 过年默认给红色
  const today = new Date().getTime();

  // 设置主题颜色
  const currentTheme =
    LocalStorage.getItem<ThemeId>(vars.keys.color) ?? "black";
  utils.changeBrand(
    THEMES.find(x => x.id === currentTheme) ?? THEMES[0]
  );

  printLogo();
};

export const TITLE =
  process.env.NODE_ENV === "production" ? "Data Management System" : "DMS";
