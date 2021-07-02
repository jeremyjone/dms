import Vue from "vue";
import NoticeComponent from "./Notice.vue";

export interface NoticeOptions {
  message: string;
  duration?: number;
  position?: "top-left" | "bottom-left" | "top-right" | "bottom-right";
  type?: "success" | "warning" | "info" | "error";
  title?: string;
  closeBtn?: boolean;
  icon?: boolean;
  okBtn?: { name?: string; action?: Function };
  cancelBtn?: { name?: string; action?: Function };
  [prop: string]: any;
}

const MARGIN = 16;
const NoticeConstructor = Vue.extend(NoticeComponent);
let SEED = 0;
const instances = [] as Vue[];

const updateHeight = (index: number, instance: any) => {
  const _instances = instances.filter(
    x => x.$data.position === instance.$data.position
  );
  if (
    index === 0 ||
    _instances.length === 0 ||
    (_instances.length > 0 && _instances[0].$data.id === instance.$data.id)
  ) {
    (instance.$el as HTMLElement).style[instance.align] = MARGIN + "px";
  } else {
    (instance.$el as HTMLElement).style[instance.align] =
      parseInt(
        (_instances[index - 1].$el as HTMLElement).style[instance.align]
      ) +
      (_instances[index - 1].$el as HTMLElement).offsetHeight +
      MARGIN +
      "px";
  }
};

const close = (id: number) => {
  const _index = instances.findIndex(x => x.$data.id === id);
  const instance = instances[_index];
  instances.splice(_index, 1);

  if (instance) {
    const _instances = instances.filter(
      x => x.$data.position === instance.$data.position
    );

    for (let i = _index; i < _instances.length; i++) {
      updateHeight(i, _instances[i]);
    }

    setTimeout(() => {
      document.body.removeChild(instance.$el);
    }, 500);
  }
};

export function notice(options: NoticeOptions) {
  const id = SEED++;

  const defaultOpts = {
    id,
    message: "",
    position: "top-right",
    duration: 3000,
    type: "info",
    title: "",
    icon: true,
    closeBtn: false,
    okBtn: void 0,
    cancelBtn: void 0
  } as NoticeOptions;

  "id" in options && delete options.id;

  const instance = new NoticeConstructor({
    data: Object.assign(defaultOpts, options),
    methods: {
      onClose: close
    }
  });

  instance.$mount();
  document.body.appendChild(instance.$el);

  updateHeight(
    instances.filter(x => x.$data.position === options.position).length,
    instance
  );
  instances.push(instance);
}
