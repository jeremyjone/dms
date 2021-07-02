<template>
  <q-layout view="hHr Lpr lff">
    <dms-header />

    <q-page-container :style="{ 'min-width': 'inherit' }">
      <q-page>
        <q-drawer show-if-above elevated :width="200">
          <q-scroll-area class="fit">
            <q-list class="rounded-borders">
              <dms-side-menu
                v-for="item in menus"
                :key="item.id"
                :item="item"
                :level="0"
                :selected="selected"
                @select="t => (selected = t)"
              />
            </q-list>
          </q-scroll-area>
        </q-drawer>

        <q-layout view="hHh Lpr lff" container class="dms-body-height-none">
          <router-view />
        </q-layout>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { DmsHeader, DmsSideMenu } from "@/components";
import { SideMenuItem } from "@/models/common";
import { AdminMenus } from "@/router/admin";
import { RoutePoint } from "@/router";

export default Vue.extend({
  name: "DmsHomePage",

  created() {
    const find = (arr: SideMenuItem[]) => {
      arr.forEach(x => {
        if (x.id === this.$route.name) {
          this.selected = x;
          return;
        }

        x.children && x.children.length > 0 && find(x.children);
      });
    };

    find(this.menus);
  },

  data() {
    return {
      selected: {} as SideMenuItem
    };
  },

  computed: {
    menus(): SideMenuItem[] {
      const res = [] as SideMenuItem[];

      const list2Tree = (items: RoutePoint[], menus: SideMenuItem[]) => {
        items
          .filter(x => x.text) // text 为空，忽略。可以控制哪些路由需要显示为菜单
          .forEach(x => {
            const menu = {
              name: x.text,
              id: x.name,
              url: x.path,
              children: []
            } as SideMenuItem;

            if (x.children && x.children.length > 0)
              list2Tree(x.children, menu?.children ?? []);

            menus.push(menu);
          });
      };

      AdminMenus && list2Tree(AdminMenus, res);

      return res;
    }
  },

  watch: {
    selected(nv: SideMenuItem) {
      nv.url !== this.$route.path && this.$router.push({ path: nv.url });
    }
  },

  components: {
    DmsHeader,
    DmsSideMenu
  }
});
</script>

<style></style>
