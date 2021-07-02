<template>
  <div
    :class="`full-width row flex ${realBgColor.cls}`"
    :style="{
      height: `${realHeight}px`,
      ...realBgColor.syl,
      ...realSticky,
      ...realBorder
    }"
  >
    <q-btn
      class="col-1 text-primary-text"
      :style="{
        visibility: !!leftBtn.name || !!leftBtn.icon ? 'visible' : 'hidden'
      }"
      :label="leftBtn.name"
      :icon="leftBtn.icon"
      @click="() => leftBtn.action()"
    />

    <p
      class="col-10 q-ma-none q-mt-sm text-center text-primary-text"
      :style="{ 'font-size': `${realHeight * 0.4}px`, ...realBold }"
    >
      {{ title }}
    </p>

    <q-btn
      class="col-1 text-primary-text"
      :style="{
        visibility: !!rightBtn.name || !!rightBtn.icon ? 'visible' : 'hidden'
      }"
      :label="rightBtn.name"
      :icon="rightBtn.icon"
      @click="() => rightBtn.action()"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

interface ColorStyle {
  cls: string;
  syl: object;
}

interface BtnProp {
  name?: string;
  icon?: string;
  action: Function;
}

export default Vue.extend({
  name: "DmsItemHeader",

  props: {
    title: {
      type: String,
      required: true
    },

    height: {
      type: [Number, String],
      default: 40
    },

    bgColor: {
      type: String,
      default: "primary"
    },

    sticky: {
      type: Boolean,
      required: false
    },

    bordered: {
      type: Boolean,
      required: false
    },

    bold: {
      type: Boolean,
      default: false
    },

    leftBtn: {
      type: Object as PropType<BtnProp>,
      default: () => {
        return {
          name: "",
          icon: "",
          action: () => {
            return void 0;
          }
        };
      },
      required: false
    },

    rightBtn: {
      type: Object as PropType<BtnProp>,
      default: () => {
        return {
          name: "",
          icon: "",
          action: () => {
            return void 0;
          }
        };
      },
      required: false
    }
  },

  data() {
    return {};
  },

  computed: {
    realHeight(): number {
      return parseInt(this.height.toString());
    },

    realBgColor(): ColorStyle {
      let color = "";
      let style = {};

      if (this.bgColor.startsWith("#")) {
        style = { "background-color": this.bgColor };
      } else {
        color = "bg-" + this.bgColor;
      }
      return { cls: color, syl: style };
    },

    realSticky(): object {
      return this.sticky
        ? {
            position: "sticky",
            top: 0,
            "z-index": 99
          }
        : {};
    },

    realBorder(): object {
      return this.bordered
        ? {
            "border-top-left-radius": "4px",
            "border-top-right-radius": "4px"
          }
        : {};
    },

    realBold(): object {
      return this.bold ? { "font-weight": "bold" } : {};
    }
  }
});
</script>

<style lang="stylus" scoped></style>
