<template>
  <div
    class="shadow-4"
    :class="{
      'dms-border-color': !$q.dark.isActive,
      'dms-dark-border-color': $q.dark.isActive,
      'dms-bg-color': !$q.dark.isActive,
      'dms-dark-bg-color': $q.dark.isActive
    }"
    :style="{ ...realBorder }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "DmsCommonPanel",

  props: {
    bordered: {
      type: Boolean,
      required: false
    }
  },

  data() {
    return {};
  },

  computed: {
    realBorder(): object {
      return this.bordered
        ? {
            "border-radius": "4px"
          }
        : {};
    }
  }
});
</script>

<style lang="stylus">
.dms-border-color
    border 1px solid $separator-color

.dms-dark-border-color
    border 1px solid $separator-dark-color

.dms-bg-color
    background-color #fff

.dms-dark-bg-color
    background-color $dark
</style>
