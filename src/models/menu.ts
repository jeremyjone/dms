export interface MenuItem {
  /**
   * 分割线，为 true 时其他值无效
   */
  separator?: boolean;
  /**
   * 菜单名
   */
  name?: string;
  /**
   * 菜单名文字颜色，可以作为特殊选择使用
   */
  color?: string;
  /**
   * 菜单的左侧图标，material design 的图标库中的名称
   */
  icon?: string;
  /**
   * 菜单要执行的回调函数，有子项时触发无效
   */
  action?: Function;
  /**
   * 子项
   */
  children?: MenuItem[];
  /**
   * 是否显示，可以动态改变
   * 需要判断是否显式的给出了 show 字段，如果只是 undefined，不做判断。
   * 也就是表示：默认就是显示，只有 show 字段显式地给了 false 才隐藏
   */
  show?: boolean;
  /**
   * 显示菜单，但是禁用
   */
  disable?: boolean;
  /**
   * 在当前菜单上显示一个提示。如果菜单为禁用，建议使用一个提示。
   */
  tip?: string;
}

type VerticalOrigin = "top" | "center" | "bottom";
type HorizontalOrigin = "left" | "middle" | "right";

export interface MenuAnchorType {
  vertical: VerticalOrigin;
  horizontal: HorizontalOrigin;
}

export interface MenuSelfType {
  vertical: VerticalOrigin;
  horizontal: HorizontalOrigin;
}
