import { RoutePathType } from "@/router";
import { Api } from "@/api";
import { Utils } from "@/utils";
import { Vars } from "@/utils/vars";
import {
  ToastType,
  ToastPosition,
  NoticeOptions,
  PwUploadDialog
} from "./components";
import { AppUserManager } from "./utils/extManager";

declare module "vue/types/vue" {
  interface Vue {
    $pw: {
      route: Record<RoutePathType, string>;

      toast: (
        message: string,
        type?: ToastType,
        position?: ToastPosition
      ) => Function;

      viewer: (
        vnode: Vue,
        urlList: string[],
        index?: number,
        local?: boolean
      ) => DialogChainObject;

      notice: (options: NoticeOptions) => void;

      extManager: AppUserManager
    };

    $s: Api;

    $u: Utils;

    $v: Vars;
  }
}
