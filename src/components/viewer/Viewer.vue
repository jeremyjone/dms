<template>
  <q-dialog
    ref="dialog"
    persistent
    maximized
    transition-show="scale"
    transition-hide="scale"
    @hide="onDialogHide"
  >
    <q-card class="background-blur">
      <q-card-section horizontal class="full-height">
        <q-btn
          class="absolute-top-right q-ma-md z-max"
          flat
          round
          icon="close"
          v-close-popup
        >
          <q-tooltip content-class="bg-white text-primary">关闭</q-tooltip>
        </q-btn>

        <div class="full-height absolute-left" :style="{ width: '100px' }">
          <q-btn
            flat
            round
            class="absolute-center z-top"
            icon="chevron_left"
            :disable="isFirst"
            @click="prev"
          >
            <q-tooltip
              v-if="!isFirst"
              anchor="top middle"
              self="bottom middle"
              content-class="bg-white text-primary"
            >
              前一张
            </q-tooltip>
          </q-btn>
        </div>

        <div class="fixed-center">
          <img
            ref="img"
            class="el-image-viewer__img"
            :key="urlList[index]"
            :src="
              local ? currentImg : require(`@/assets/images/test/${currentImg}`)
            "
            :style="imgStyle"
            @load="handleImgLoad"
            @error="handleImgError"
            @mousedown="handleMouseDown"
          />
        </div>

        <div class="full-height absolute-right" :style="{ width: '100px' }">
          <q-btn
            flat
            round
            class="absolute-center z-top"
            icon="chevron_right"
            :disable="isLast"
            @click="next"
          >
            <q-tooltip
              v-if="!isLast"
              anchor="top middle"
              self="bottom middle"
              content-class="bg-white text-primary"
            >
              后一张
            </q-tooltip>
          </q-btn>
        </div>

        <div
          class="background-blur absolute-bottom z-top q-mx-auto flex justify-center"
          :style="{
            width: '300px',
            'border-radius': '50px',
            'margin-bottom': '100px'
          }"
        >
          <q-btn flat round icon="zoom_in" @click="handleActions('zoomIn')">
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              content-class="bg-white text-primary"
            >
              放大
            </q-tooltip>
          </q-btn>
          <q-btn flat round icon="zoom_out" @click="handleActions('zoomOut')">
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              content-class="bg-white text-primary"
            >
              缩小
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="rotate_left"
            @click="handleActions('anticlocelise')"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              content-class="bg-white text-primary"
            >
              逆时针旋转
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="rotate_right"
            @click="handleActions('clocelise')"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              content-class="bg-white text-primary"
            >
              顺时针旋转
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { on, off } from "./dom";
import { rafThrottle, isFirefox } from "./util";

const Mode = {
  CONTAIN: {
    name: "contain",
    icon: "el-icon-full-screen"
  },
  ORIGINAL: {
    name: "original",
    icon: "el-icon-c-scale-to-original"
  }
};

const mousewheelEventName = isFirefox() ? "DOMMouseScroll" : "mousewheel";

export default {
  name: "elImageViewer",

  props: {
    urlList: {
      type: Array,
      default: () => []
    },

    ids: {
      type: Number,
      default: 0
    },

    local: {
      type: Boolean,
      default: false
    }
  },

  beforeMount() {
    this.index = this.ids;
  },

  mounted() {
    this.deviceSupportInstall();
  },

  data() {
    return {
      index: 0,
      loading: false,
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    };
  },
  computed: {
    isSingle() {
      return this.urlList.length <= 1;
    },
    isFirst() {
      return this.index === 0;
    },
    isLast() {
      return this.index === this.urlList.length - 1;
    },
    currentImg() {
      return this.urlList[this.index];
    },
    imgStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform;
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? "transform .3s" : "",
        "margin-left": `${offsetX}px`,
        "margin-top": `${offsetY}px`
      };
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = "100%";
      }
      return style;
    }
  },
  watch: {
    index: {
      handler: function() {
        this.reset();
      }
    },
    currentImg() {
      this.$nextTick(() => {
        // const $img = this.$refs.img[0];
      });
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },

    hide() {
      this.$refs.dialog.hide();
      this.deviceSupportUninstall();
    },

    onDialogHide() {
      this.$emit("hide");
    },

    onOKClick() {
      this.$emit("ok");
      this.hide();
    },

    onCancelClick() {
      this.hide();
    },

    deviceSupportInstall() {
      this._keyDownHandler = rafThrottle(e => {
        const keyCode = e.keyCode;
        switch (keyCode) {
          // ESC
          case 27:
            this.hide();
            break;
          // SPACE
          case 32:
            this.toggleMode();
            break;
          // LEFT_ARROW
          case 37:
            this.prev();
            break;
          // UP_ARROW
          case 38:
            this.handleActions("zoomIn");
            break;
          // RIGHT_ARROW
          case 39:
            this.next();
            break;
          // DOWN_ARROW
          case 40:
            this.handleActions("zoomOut");
            break;
        }
      });
      this._mouseWheelHandler = rafThrottle(e => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (delta > 0) {
          this.handleActions("zoomIn", {
            zoomRate: 0.015,
            enableTransition: false
          });
        } else {
          this.handleActions("zoomOut", {
            zoomRate: 0.015,
            enableTransition: false
          });
        }
      });
      on(document, "keydown", this._keyDownHandler);
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    deviceSupportUninstall() {
      off(document, "keydown", this._keyDownHandler);
      off(document, mousewheelEventName, this._mouseWheelHandler);
      this._keyDownHandler = null;
      this._mouseWheelHandler = null;
    },
    handleImgLoad() {
      this.loading = false;
    },
    handleImgError(e) {
      this.loading = false;
      e.target.alt = "加载失败";
    },
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return;

      const { offsetX, offsetY } = this.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      this._dragHandler = rafThrottle(ev => {
        this.transform.offsetX = offsetX + ev.pageX - startX;
        this.transform.offsetY = offsetY + ev.pageY - startY;
      });
      on(document, "mousemove", this._dragHandler);
      on(document, "mouseup", () => {
        off(document, "mousemove", this._dragHandler);
      });

      e.preventDefault();
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      };
    },
    toggleMode() {
      if (this.loading) return;

      const modeNames = Object.keys(Mode);
      const modeValues = Object.values(Mode);
      const index = modeValues.indexOf(this.mode);
      const nextIndex = (index + 1) % modeNames.length;
      this.mode = Mode[modeNames[nextIndex]];
      this.reset();
    },
    prev() {
      if (this.isFirst) return;
      const len = this.urlList.length;
      this.index = (this.index - 1 + len) % len;
    },
    next() {
      if (this.isLast) return;
      const len = this.urlList.length;
      this.index = (this.index + 1) % len;
    },
    handleActions(action, options = {}) {
      if (this.loading) return;
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      };
      const { transform } = this;
      switch (action) {
        case "zoomOut":
          if (transform.scale > 0.2) {
            transform.scale = parseFloat(
              (transform.scale - zoomRate).toFixed(3)
            );
          }
          break;
        case "zoomIn":
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case "clocelise":
          transform.deg += rotateDeg;
          break;
        case "anticlocelise":
          transform.deg -= rotateDeg;
          break;
      }
      transform.enableTransition = enableTransition;
    }
  }
};
</script>

<style lang="stylus" scoped>
.background-blur
    background hsla(0, 0%, 100%, 0.5)
    -webkit-backdrop-filter blur(5px)
    backdrop-filter blur(5px)
</style>
