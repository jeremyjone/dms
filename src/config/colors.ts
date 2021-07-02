import { ThemeOption } from "@/models/common";

// *************************** //
// ********* 配置颜色 ********* //
// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ //

// 系统主题
export const THEMES = [
  {
    id: "jeremyjone",
    name: "主题色",
    color: "#1cd6ee",
    secondary: "#0A515A"
  },
  {
    id: "black",
    name: "暗夜黑",
    color: "#212426",
    secondary: "#436D74",
    accent: "#9C27B0"
  },
  {
    id: "purple",
    name: "葡萄紫",
    color: "#341F97",
    secondary: "#6A50AC"
  },
  {
    id: "pink",
    name: "莲花粉",
    color: "#8e44ad",
    secondary: "#BD75C5"
  },
  {
    id: "red",
    name: "樱桃红",
    color: "#C0392B",
    secondary: "#F08491",
    accent: "#5f27cd"
  },
  {
    id: "yellow",
    name: "柠檬黄",
    color: "#F39C12",
    secondary: "#E8C361"
  },
  {
    id: "blue",
    name: "天空蓝",
    color: "#1A7EC4",
    secondary: "#40A0B0"
  },
  {
    id: "green",
    name: "草原绿",
    color: "#158143",
    secondary: "#56B896"
  }
].map(x =>
  Object.assign(
    {
      color: "#212426",
      secondary: "#436D74",
      accent: "#9C27B0",
      positive: "#21BA45",
      negative: "#C10015",
      info: "#31CCEC",
      warning: "#F2C037"
    },
    x
  )
) as ThemeOption[];

// 取消框颜色
export const CANCEL_COLOR = "#9DAAB4";

// 滚动条默认颜色
export const SCROLLBAR_COLOR_LIGHT = "#eaeaea";
export const SCROLLBAR_COLOR_DARK = "#313131";

// 业务颜色
export const SHOT = {
  SELECT: "#2974D3",
  HOVER: "#50B2F0",
  LEVEL: ["#A2C1C9", "#D1D6B2", "#C4CBCB", "#EAEAEA"]
};

// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ //
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ //
