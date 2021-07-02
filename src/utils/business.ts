import jssha256 from "jssha/dist/sha256";
import {
  CANCEL_COLOR,
  SCROLLBAR_COLOR_DARK,
  SCROLLBAR_COLOR_LIGHT
} from "@/config/colors";
import store from "@/store";
import { ThemeOption } from "@/models/common";
import { colors, LocalStorage } from "quasar";
import { vars } from "./vars";

export function encrypt(value: string) {
  const sha = new jssha256("SHA-256", "TEXT", { encoding: "UTF8" });
  sha.update(value);
  return sha.getHash("HEX");
}

export function hasRole(role: string): boolean {
  const r = store.state.user.role;
  return r.find(x => x.name === role) !== undefined;
}

/**
 * 换肤功能
 * @param {string} color HEX颜色
 */
export function changeBrand(item: ThemeOption) {
  // 保存自定义颜色属性
  LocalStorage.set(vars.keys.color, item.id);

  // 设置主色
  colors.setBrand("primary", item.color);
  colors.setBrand("secondary", item.secondary);
  colors.setBrand("accent", item.accent);
  item.positive && colors.setBrand("positive", item.positive);
  item.negative && colors.setBrand("negative", item.negative);
  item.info && colors.setBrand("info", item.info);
  item.warning && colors.setBrand("warning", item.warning);

  // ↓↓↓↓↓ 设置自定义颜色 ↓↓↓↓↓
  // 取消颜色
  colors.setBrand(
    "cancel",
    colors.blend(colors.changeAlpha(item.color, 0.5), CANCEL_COLOR)
  );

  // 滚动条颜色
  colors.setBrand(
    "scrollbar-track",
    colors.brightness(item.color) < 128
      ? SCROLLBAR_COLOR_LIGHT
      : SCROLLBAR_COLOR_DARK
  );
  colors.setBrand("scrollbar-thumb", colors.lighten(item.color, -50));
  colors.setBrand("scrollbar-hover", colors.lighten(item.color, -40));
}

export const lighten = colors.lighten;
export const getBrand = colors.getBrand;
