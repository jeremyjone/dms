import { UserItem } from "./user";

export interface DataItem {
  id: number;
  name: string;
  size: number;
  type: string;
  thumbnail: string;
  description: string;
  creatorId: number;
  creator: UserItem;
  parentId: number;
  fileId: number;
  libraryId: number;
  updateTime: string;
  createTime: string;
}

export interface DataAddItem {
  name: string;
  type: string;
  thumbnail: string;
  description: string;
  parentId: number;
  fileId: number;
  libraryId: number;
  creatorId: number;
  versionComment?: string;
}

export interface DataUpdateItem {
  name: string;
  type: string;
  thumbnail: string;
  description: string;
  parentId: number;
  fileId: number;
  libraryId: number;
  creatorId: number;
  versionComment?: string;
}

export interface DataUpdateItems {
  id: number;
  data: DataUpdateItem;
}

export type DataShowMode = "icon" | "list";

export type DataShowModeConfigKey =
  | "size"
  | "updator"
  | "creator"
  | "updatedate"
  | "createdate"
  | "customIcon";

export type DataShowModeConfig = {
  [key in DataShowModeConfigKey]: boolean;
};

// 上面配置默认值，需要与键一一对应
export const DEFAULT_DATA_SHOW_MODE_CONFIG: DataShowModeConfig = {
  size: true,
  updator: false,
  creator: true,
  updatedate: false,
  createdate: true,
  customIcon: true
};
