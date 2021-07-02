<template>
  <transition :name="`j-notice-${transition}`">
    <div
      ref="notice"
      class="j-notice flex no-wrap"
      v-show="show"
      :style="{
        background: $q.dark.isActive ? '#121212' : '#fff',
        'max-width': '500px',
        ...pos
      }"
      @mouseenter="clearThread"
      @mouseleave="startThread"
    >
      <q-icon
        v-if="icon"
        class="q-mr-md"
        size="24px"
        :name="iconProp.name"
        :color="iconProp.color"
      />

      <div class="column inline">
        <section class="flex items-center">
          <strong class="text-subtitle1 text-weight-bold">{{
            realTitle
          }}</strong>
          <q-space v-if="closeBtn" :style="{ 'min-width': '50px' }" />
          <q-btn
            v-if="closeBtn"
            flat
            size="xs"
            round
            icon="close"
            @click="handleClose"
          />
        </section>

        <label>{{ message }}</label>

        <section
          class="flex q-gutter-x-xs q-mt-md"
          :class="`justify-${justify === 'start' ? 'end' : 'start'}`"
        >
          <q-btn
            v-if="okBtn"
            flat
            :label="`${okBtn.name || '确定'}`"
            @click="
              () => {
                okBtn.action && okBtn.action();
                handleClose();
              }
            "
          />
          <q-btn
            v-if="cancelBtn"
            flat
            :label="`${cancelBtn.name || '取消'}`"
            @click="
              () => {
                cancelBtn.action && cancelBtn.action();
                handleClose();
              }
            "
          />
        </section>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Notice",

  props: {},

  // beforeCreate() {},

  created() {
    this.startThread();
  },

  // beforeMount() {},

  mounted() {
    this.show = true;
  },

  // beforeDestroy() {},

  // destroyed() {},

  data() {
    return {
      show: false,
      thread: 0
    } as any;
  },

  computed: {
    realTitle(): string {
      if (this.title) {
        return this.title;
      } else {
        switch (this.type) {
          case "success":
            return "成功";
          case "warning":
            return "警告";
          case "error":
            return "错误";
          default:
            return "消息";
        }
      }
    },

    iconProp(): { name: string; color: string } {
      switch (this.type) {
        case "success":
          return { name: "check_circle", color: "positive" };
        case "warning":
          return { name: "warning", color: "warning" };
        case "error":
          return { name: "cancel", color: "negative" };
        default:
          return { name: "info", color: "info" };
      }
    },

    transition(): string {
      return this.position || "top-right";
    },

    pos() {
      switch (this.position || "") {
        case "top-left":
          return {
            top: 0,
            left: 0
          };
        case "bottom-left":
          return {
            bottom: 0,
            left: 0
          };
        case "bottom-right":
          return {
            bottom: 0,
            right: 0
          };
        default:
          return {
            top: 0,
            right: 0
          };
      }
    },

    align() {
      switch (this.position || "") {
        case "bottom-left":
        case "bottom-right":
          return "bottom";
        case "top-left":
        default:
          return "top";
      }
    },

    justify() {
      switch (this.position || "") {
        case "top-left":
        case "bottom-left":
          return "start";
        case "bottom-right":
        default:
          return "end";
      }
    }
  },

  watch: {},

  methods: {
    handleClose() {
      this.show = false;
      this.onClose(this?.id ?? -1);
    },

    clearThread() {
      this.thread && window.clearTimeout(this.thread);
    },

    startThread() {
      this.clearThread();

      this.thread = window.setTimeout(() => {
        this.handleClose();
      }, this.duration);
    }
  },

  components: {}
});
</script>

<style lang="stylus" scoped>
.j-notice
  position fixed
  padding 16px
  border solid 1px #999
  border-radius 4px
  box-shadow 0px 1px 2px #ccc
  z-index 9999
  transition .2s

.j-notice-top-right-enter-active .j-notice-top-right-leave-active
.j-notice-top-left-enter-active .j-notice-top-left-leave-active
.j-notice-bottom-right-enter-active .j-notice-bottom-right-leave-active
.j-notice-bottom-left-enter-active .j-notice-bottom-left-leave-active
  transition: all .5s;

.j-notice-top-right-enter, .j-notice-top-right-leave-to
.j-notice-bottom-right-enter, .j-notice-bottom-right-leave-to
  transform: translateX(120%);
  opacity: 0;


.j-notice-bottom-left-enter, .j-notice-bottom-left-leave-to
.j-notice-top-left-enter, .j-notice-top-left-leave-to
  transform: translateX(-120%);
  opacity: 0;
</style>
