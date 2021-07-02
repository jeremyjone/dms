<template>
  <div>
    <q-header elevated class="glossy dms-header">
      <q-toolbar class="full-height">
        <q-tabs
          inline-label
          dense
          left-icon="none"
          right-icon="none"
          align="left"
          stretch
          :breakpoint="0"
        >
          <q-route-tab
            :to="$pw.route.home"
            exact
            class="dms-clear-min-width dms-clear-nav-bottom-line"
          >
            <span class="text-h5"> 资料管理系统 </span>
          </q-route-tab>
        </q-tabs>

        <q-space />

        <div class="q-mr-md non-selectable text-subtitle2">
          Made By JeremyJone丶小鹰
        </div>
        <div class="q-mr-md non-selectable text-caption">
          version: {{ version }}
        </div>

        <q-btn
          v-if="$u.hasRole('system.show')"
          flat
          dense
          class="q-mx-md"
          label="管理"
          :to="$pw.route.admin"
        />

        <q-btn
          flat
          dense
          round
          @click="drawerOpen = !drawerOpen"
          aria-label="Menu"
          icon="menu"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" side="right" bordered>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px">
        <q-list padding>
          <q-item-label header>设置</q-item-label>

          <q-item v-ripple>
            <q-item-section avatar>
              <q-icon :name="`${isDark ? 'dark' : 'light'}_mode`" />
            </q-item-section>

            <q-item-section>
              <q-item-label>黑暗模式</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-toggle color="blue" v-model="isDark" />
            </q-item-section>
          </q-item>

          <q-expansion-item dense>
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon name="palette" />
              </q-item-section>
              <q-item-section> 换肤 </q-item-section>
            </template>

            <q-btn-group spread>
              <q-btn
                glossy
                dense
                v-for="theme in themes"
                :key="theme.id"
                :style="{ background: theme.color }"
                @click="() => changeTheme(theme)"
              />
            </q-btn-group>
          </q-expansion-item>

          <q-separator spaced inset="item" />

          <q-item clickable v-ripple @click="handleLogout">
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>

            <q-item-section> 登出 </q-item-section>
          </q-item>

          <q-separator spaced inset />

          <q-item-label header>信息</q-item-label>

          <q-item
            clickable
            v-ripple
            @click="() => open('https://github.com/jeremyjone/dms')"
          >
            <q-item-section avatar>
              <q-icon name="link" />
            </q-item-section>

            <q-item-section>
              <q-item-label>GitHub</q-item-label>
              <q-item-label caption>{{ version }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">{{ $store.getters.name }}</div>
          <div>@{{ $store.state.user.username }}</div>
        </div>
      </q-img>
    </q-drawer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { THEMES } from "@/config/colors";
import { ThemeOption } from "@/models/common";

export default Vue.extend({
  data() {
    return {
      drawerOpen: false,
      color: "black",
      themes: THEMES,
      version: require("@/../package.json").version
    };
  },

  computed: {
    isDark: {
      get() {
        return this.$q.dark.isActive;
      },
      set(value: boolean) {
        this.$q.localStorage.set(this.$v.keys.dark, value);
        this.$q.dark.set(value);
      }
    }
  },

  methods: {
    async handleLogout() {
      await this.$store.dispatch("Logout");
    },

    changeTheme(item: ThemeOption): void {
      if (this.color === item.id) return;

      this.color = item.id;
      this.$u.changeBrand(item);
      this.$pw.toast("主题切换为：" + item.name, "success");
    },

    open(url: string): void {
      window.open(url, "_blank");
    }
  }
});
</script>
