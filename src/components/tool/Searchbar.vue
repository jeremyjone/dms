<template>
  <div>
    <q-input
      ref="searchBar"
      class="dms-transition"
      v-model="text"
      :dense="dense"
      :rounded="rounded"
      :input-class="`text-${textColor} text-right`"
      :standout="`bg-${color}`"
      :placeholder="placeholder"
      :style="{
        right: 0,
        width: `${showSearch ? `${width}px` : '30px'}`,
        visibility: `${showSearch ? 'visible' : 'hidden'}`
      }"
      :input-style="{ 'padding-right': `${dense ? 35 : 50}px` }"
      @blur="
        () => {
          keepSearchStatus = false;
          hideSearchBar();
        }
      "
      @keypress.enter.stop="handleSearch"
    />
    <!-- 关于圆角： -->
    <!--   round：dense时使用 -->
    <!--   style：!dense时使用 -->
    <q-btn
      icon="search"
      class="absolute-right"
      style="transition: 'all 0.2s'"
      :flat="showSearch"
      :round="dense && rounded"
      :color="color"
      :text-color="textColor"
      :style="dense || !rounded ? {} : { 'border-radius': '50%' }"
      @click.stop="handleSearch"
    />
  </div>
</template>

<script lang="ts">
import { CustomVueComponent } from "@/models/common";
import Vue from "vue";

export default Vue.extend({
  name: "Searchbar",

  props: {
    placeholder: {
      type: String,
      default: "搜索"
    },

    color: {
      type: String,
      default: "primary"
    },

    textColor: {
      type: String,
      default: "white"
    },

    width: {
      type: Number,
      default: 300
    },

    rounded: {
      type: Boolean,
      default: false
    },

    dense: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      text: "",
      showSearch: false,
      keepSearchStatus: false
    };
  },

  computed: {},

  watch: {},

  methods: {
    hideSearchBar() {
      const t = setTimeout(() => {
        if (this.keepSearchStatus) {
          clearTimeout(t);
          return;
        }

        this.showSearch = false;
      }, 200);
    },

    // 搜索函数
    handleSearch() {
      const originStatus = this.showSearch;

      if (!this.showSearch) {
        this.text = "";
        this.showSearch = true;
        setTimeout(() => {
          (this.$refs.searchBar as CustomVueComponent).focus();
        }, 200);
      }

      // 没有打开，不执行查询
      if (!originStatus) return;

      // 没有文本，执行关闭
      if (!this.text) {
        this.showSearch = false;
        return;
      }

      this.$emit("search", this.text);

      // 点击搜索后，仍然使输入框处于 focus 状态
      (this.$refs.searchBar as CustomVueComponent).focus();
      this.keepSearchStatus = true;
    }
  },

  components: {}
});
</script>

<style lang="stylus" scoped></style>
