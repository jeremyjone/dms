import * as handle from "./handle";
import * as business from "./business";
import { format } from "quasar";
import { protocolCheck } from "./protocolCheck";
import { ThemeOption } from "@/models/common";
import { GetFileType } from "@/config/files";

export const utils = {
  hasRole: business.hasRole,
  changeBrand: business.changeBrand,
  lighten: business.lighten,
  getBrand: business.getBrand,
  encrypt: business.encrypt,

  to: handle.to,
  find: handle.find,
  similarColor: handle.similarColor,
  b2f: handle.base64toFile,

  protocolCheck: protocolCheck,
  humanStorageSize: format.humanStorageSize,

  fileType: GetFileType
};

export interface Utils {
  hasRole: (role: string) => boolean;
  changeBrand(item: ThemeOption): void;
  lighten(color: string, percent: number): string;
  getBrand(color: string, element?: Element | undefined): string | null;
  encrypt(value: string): string;

  to<T, U = any>(
    promise: Promise<T>,
    errorExt?: object | undefined
  ): Promise<[U | null, T | undefined]>;
  /**
   * 主要给 template 中无法使用 es6以上语法时提供一个可以填写默认值的查找方法
   * @param key 要查找的建
   * @param value 要查找的值
   * @param data 数据源
   * @param defaultValue 默认值
   * @template find("id", row.id, users, { name: "unknown" }).name
   */
  find<T>(
    key: string,
    value: any,
    data: T[],
    defaultValue?: T | undefined
  ): T | undefined;
  similarColor: (originColor: string) => string;
  b2f: (base64: string) => File;

  protocolCheck: (
    uri: string,
    failCb?: Function,
    successCb?: Function,
    unsupportedCb?: Function
  ) => void;
  humanStorageSize: (size: number) => string;

  fileType: (type: string) => string;
}
