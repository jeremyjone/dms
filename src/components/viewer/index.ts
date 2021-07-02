import Vue from "vue";
import { Dialog } from "quasar";
import ImageViewer from "./Viewer.vue";

export function viewer(
  vnode: Vue,
  urlList: string[],
  index = 0,
  local = false
) {
  return Dialog.create({
    component: ImageViewer,
    parent: vnode,
    urlList: urlList,
    ids: index,
    local: local
  });
}
