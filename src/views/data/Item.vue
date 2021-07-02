<template>
  <div
    v-intersection.once="onIntersection"
    class="dms-transition-fast q-pa-xs"
    :class="{
      'item-selected-light': select && !$q.dark.isActive,
      'item-selected-dark': select && $q.dark.isActive,
      'dms-data-item-light': !$q.dark.isActive,
      'dms-data-item-dark': $q.dark.isActive,
      'dms-data-item-icon-mode inline-block text-center': mode === 'icon'
    }"
    :style="
      mode === 'icon'
        ? {
            width: `${size + 20}px`,
            height: `${size + (selectMany ? 70 : 40)}px`
          }
        : {}
    "
    :draggable="draggable || data.creatorId === userId"
    @click.stop="handleClick"
    @dblclick="handleDblClick"
    @contextmenu.stop="handleClick"
    @dragstart="onDrag"
    @dragover="onDragover"
    @drop="onDrop"
  >
    <!-- 列表模式 -->
    <div v-if="mode === 'list'" class="full-width text-no-wrap">
      <q-item dense class="row">
        <q-item-section avatar class="col-3 inline-block q-gutter-x-sm">
          <q-checkbox v-model="realChecked" v-show="selectMany" />
          <q-avatar rounded>
            <q-img
              crossorigin="anonymous"
              :alt="data.name"
              :src="
                !showModeConfig.customIcon || picture === ''
                  ? require(`@/assets/images/icon/files/${iconType}.png`)
                  : require(`@/assets/images/test/${picture}`)
              "
              :class="{
                'shadow-4': showModeConfig.customIcon && picture !== ''
              }"
              @error="() => setThumbnail('')"
            />
          </q-avatar>
          <strong>{{ data.name }}</strong>
        </q-item-section>

        <q-item-section class="col-1" v-if="showModeConfig.size">
          {{ isFolder ? "" : `大小：${$u.humanStorageSize(data.size)}` }}
        </q-item-section>

        <q-item-section class="col-1" v-if="showModeConfig.creator">
          创建者：{{ data.creator.nickname }}
        </q-item-section>

        <q-item-section class="col-2" v-if="showModeConfig.updatedate">
          更新日期：{{ data.updateTime }}
        </q-item-section>

        <q-item-section class="col-2" v-if="showModeConfig.createdate">
          创建日期：{{ data.createTime }}
        </q-item-section>
      </q-item>
    </div>

    <!-- 默认为图标模式 -->
    <div v-else>
      <div
        class="relative-position"
        :style="{ width: '100%', height: `${size}px` }"
      >
        <q-img
          crossorigin="anonymous"
          class="absolute-center rounded-borders"
          :alt="data.name"
          :src="
            !showModeConfig.customIcon || picture === ''
              ? require(`@/assets/images/icon/files/${iconType}.png`)
              : require(`@/assets/images/test/${picture}`)
          "
          :width="size.toString()"
          :height="size.toString()"
          :class="{ 'shadow-4': showModeConfig.customIcon && picture !== '' }"
          :style="{ 'max-width': `${size}px`, 'max-height': `${size}px` }"
          @error="() => setThumbnail('')"
        />
      </div>

      <p
        class="text-no-wrap ellipsis q-mb-none"
        :class="`q-px-${size < 70 ? 'none' : 'sm'}`"
      >
        {{ data.name }}
      </p>
      <q-checkbox v-model="realChecked" v-show="selectMany" />
    </div>

    <!-- 提示栏，显示信息 -->
    <q-tooltip anchor="bottom middle" self="top middle" :delay="500">
      <q-list>
        <q-item dense>
          <q-item-section avatar>
            {{ isFolder ? "文件夹名:" : "文件名:" }}
          </q-item-section>
          <q-item-section>{{ data.name }}</q-item-section>
        </q-item>

        <q-item dense v-if="!isFolder">
          <q-item-section avatar>文件类型:</q-item-section>
          <q-item-section>{{ data.type }}</q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section avatar>
            {{ isFolder ? "文件夹信息:" : "文件信息:" }}
          </q-item-section>
          <q-item-section>{{ data.description }}</q-item-section>
        </q-item>

        <q-item dense v-if="!isFolder">
          <q-item-section avatar>文件大小 </q-item-section>
          <q-item-section>
            {{ $u.humanStorageSize(data.size) }}
          </q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section avatar>创建者:</q-item-section>
          <q-item-section>{{ data.creator.nickname }} </q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section avatar>更新日期:</q-item-section>
          <q-item-section>{{ data.updateTime }}</q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section avatar>创建日期:</q-item-section>
          <q-item-section>{{ data.createTime }}</q-item-section>
        </q-item>
      </q-list>
    </q-tooltip>

    <!-- 右键菜单 -->
    <dms-menu
      touch-position
      context-menu
      :menu="contextMenu.filter(x => [void 0, true].includes(x.show))"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { MenuItem } from "@/models/menu";
import { DataItem, DataShowModeConfig, DataShowMode } from "@/models/data";
import { DmsMenu } from "@/components";

export default Vue.extend({
  name: "DmsDataItem",

  props: {
    data: {
      type: Object as PropType<DataItem>,
      required: true
    },

    size: {
      type: Number,
      default: 100
    },

    mode: {
      type: String as PropType<DataShowMode>,
      default: "icon"
    },

    select: {
      type: Boolean,
      default: false
    },

    contextMenu: {
      type: Array as PropType<Array<MenuItem>>,
      default: []
    },

    draggable: {
      type: Boolean,
      default: true
    },

    showModeConfig: {
      type: Object as PropType<DataShowModeConfig>,
      default: {}
    },

    selectMany: {
      type: Boolean,
      default: false
    },

    checked: {
      type: Boolean,
      default: false
    }
  },

  created() {
    this.$q.loading.show();

    this.setThumbnail(this.data.thumbnail);
    this.realChecked = this.checked;

    this.$q.loading.hide();
  },

  data() {
    return {
      repeatClick: false,
      visible: false,
      picture: "",
      realChecked: false
    };
  },

  computed: {
    isFolder(): boolean {
      return ["folder"].includes(this.data.type);
    },

    iconType(): string {
      return this.$u.fileType(this.data.type);
    },

    userId(): number {
      return this.$q.localStorage.getItem<number>(this.$v.keys.userId) ?? -1;
    }
  },

  watch: {
    "data.thumbnail"(nv) {
      this.setThumbnail(nv);
    },

    visible(nv) {
      nv && this.setThumbnail(this.data.thumbnail);
    },

    checked(nv) {
      this.realChecked !== nv && (this.realChecked = nv);
    },

    realChecked(nv) {
      this.$emit("checkout", this.data, nv);
    },

    // 关闭多选框，全部置为 false
    selectMany(nv) {
      !nv && (this.realChecked = false);
    }
  },

  methods: {
    setThumbnail(path: string) {
      this.picture = path;
    },

    handleClick() {
      if (this.repeatClick) {
        this.repeatClick = false;
        return;
      } else {
        this.$emit("click", this.data);
        this.repeatClick = true;

        window.setTimeout(() => {
          this.repeatClick = false;
        }, 500);
      }
    },

    handleDblClick() {
      this.$emit("dblclick", this.data);
    },

    onIntersection(entry: IntersectionObserverEntry) {
      this.visible = entry.isIntersecting;
    },

    // 开始拖动
    onDrag(e: DragEvent) {
      e.dataTransfer?.setData("text/plain", this.data.id + "");
    },

    // 拖动放置（目标为文件夹，触发操作）
    onDrop(e: DragEvent) {
      const dataList = e.dataTransfer?.items ?? [];
      for (const data of dataList) {
        if (data.kind === "string" && data.type.match("^text/plain")) {
          data.getAsString((val: string) => {
            // 触发移动事件
            this.isFolder &&
              this.$emit("move", { source: Number(val), target: this.data });
          });
        }
      }
    },

    // 拖动过程，显示拖动到哪里
    onDragover(e: DragEvent) {
      // 非文件夹，不启用拖动
      // 阻止默认事件
      this.isFolder && e.preventDefault();
    }
  },

  components: {
    DmsMenu
  }
});
</script>

<style lang="stylus" scoped>
.dms-data-item-icon-mode
  box-sizing border-box
  -moz-box-sizing border-box
  -webkit-box-sizing border-box

.dms-data-item-light
  border 1px solid rgba(#99D1FF, 0)
  &:hover
    background-color #E5F3FF

  &:active
    background-color #D8EAF9

.item-selected-light
  background-color #CCE8FF
  border 1px solid #99D1FF

.dms-data-item-dark
  border 1px solid rgba(#5A5A5A, 0)
  &:hover
    background-color #333333

  &:active
    background-color #777777

.item-selected-dark
  background-color #555555
  border 1px solid #5A5A5A
</style>
