<template>
  <div class="dms-tool-bar">
    <q-toolbar
      class="dms-clear-min-height dms-tool-bar-content bg-primary text-primary-text q-px-lg"
      :class="{
        'dms-color-lighter': !$q.dark.isActive
      }"
      @click.stop
    >
      <div
        class="cursor-pointer non-selectable"
        v-for="(item, index) in menu.filter(
          x => !(isBoolean(x.show) && !x.show)
        )"
        :key="index"
      >
        <q-btn flat dense class="q-px-sm">{{ item.name }}</q-btn>

        <dms-menu
          v-if="item.children"
          :anchor="{ vertical: 'bottom', horizontal: 'left' }"
          :self="{ vertical: 'top', horizontal: 'left' }"
          :menu="item.children"
        />
      </div>

      <q-space />

      <em class="text-no-wrap ellipsis" v-html="content"></em>

      <q-space />
    </q-toolbar>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { MenuItem } from "@/models/menu";
import { isBoolean } from "@/tools";
import DmsMenu from "../menu/Menu.vue";

export default Vue.extend({
  name: "Toolbar",

  props: {
    menu: {
      type: Array as PropType<Array<MenuItem>>,
      default: () => [] as MenuItem[]
    },

    content: {
      type: String,
      default: ""
    }
  },

  methods: {
    isBoolean
  },

  components: {
    DmsMenu
  }
});
</script>

<style lang="stylus">
.dms-tool-bar
    position sticky
    top var(--header-height)
    z-index 99
    height var(--toolbar-height)
    filter brightness(90%)

.dms-tool-bar-content
    height var(--toolbar-height)
</style>
