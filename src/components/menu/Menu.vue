<template>
  <q-menu
    :anchor="realAnchor"
    :self="realSelf"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <q-list>
      <div v-for="(item, index) in showMenu" :key="index">
        <!-- 分割线，只要属性为 true，则显示分割线。但它如果处于首尾时，则不显示 -->
        <q-separator
          v-if="
            item.separator &&
              // 掐头去尾
              ![0, showMenu.length - 1].includes(index) &&
              // 相邻忽略
              !showMenu[index - 1].separator
          "
        />

        <!-- 菜单内容 -->
        <q-item
          v-if="!item.separator"
          dense
          v-close-popup="!hasChildren(item)"
          :clickable="!item.disable"
          :style="{ cursor: item.disable ? 'not-allowed' : 'default' }"
          @click="
            () =>
              !item.disable && !hasChildren(item) && handleClick(item.action)
          "
        >
          <!-- 图标 -->
          <q-item-section
            v-if="hasIcon"
            avatar
            class="clear-min-width q-pr-lg"
            :style="{ width: '16px' }"
          >
            <q-icon size="xs" :name="item.icon" />
          </q-item-section>

          <!-- 名称 -->
          <q-item-section
            class="text-no-wrap"
            :class="item.disable ? 'text-grey' : item.color"
          >
            {{ item.name }}
          </q-item-section>

          <!-- 显示子项的右侧按钮 -->
          <q-item-section v-if="hasChildren(item)" side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>

          <q-tooltip
            v-if="item.tip"
            anchor="top middle"
            self="center middle"
            :delay="200"
          >
            {{ item.tip }}
          </q-tooltip>

          <dms-menu
            v-if="hasChildren(item)"
            :anchor="{ vertical: 'top', horizontal: 'right' }"
            :self="{ vertical: 'top', horizontal: 'left' }"
            :menu="item.children"
          />
        </q-item>
      </div>

      <q-item v-if="showMenu.length === 0" dense>
        <q-item-section>空</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { MenuItem, MenuAnchorType, MenuSelfType } from "@/models/menu";
import { isFunction, isBoolean } from "@/tools";

export default Vue.extend({
  name: "DmsMenu",

  props: {
    menu: {
      type: Array as PropType<Array<MenuItem>>,
      default: () => [] as Array<MenuItem>
    },

    anchor: {
      type: Object as PropType<MenuAnchorType>,
      default: () => {
        return { vertical: "top", horizontal: "left" };
      }
    },

    self: {
      type: Object as PropType<MenuSelfType>,
      default: () => {
        return { vertical: "top", horizontal: "left" };
      }
    }
  },

  computed: {
    realAnchor() {
      return `${this.anchor.vertical} ${this.anchor.horizontal}`;
    },

    realSelf() {
      return `${this.self.vertical} ${this.self.horizontal}`;
    },

    showMenu() {
      return this.menu.filter(x => !(isBoolean(x.show) && !x.show));
    },

    hasIcon() {
      return this.menu.filter(x => x.icon).length > 0;
    }
  },

  methods: {
    hasChildren(item: MenuItem) {
      return Boolean(item.children && item.children.length > 0);
    },

    handleClick(action?: Function) {
      if (action && isFunction(action)) {
        action();
      }
    }
  }
});
</script>

<style lang="stylus" scoped>
.clear-min-width
    min-width 0

    & *
        min-width 0 !important
</style>
