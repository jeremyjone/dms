<template>
  <q-page>
    <slot name="toolbar" :menu="menu" />

    <div class="dms-body-height-none-with-bar flex items-center">
      <div
        v-show="libraries.length > 0"
        class="dms-library-container full-width flex no-wrap justify-center q-gutter-x-xs"
      >
        <dms-library-item
          class="update-data-item dms-library-card"
          v-for="library in libraries"
          :key="library.id"
          :library="library"
          @update="handleUpdateLibrary"
          @delete="handleDeleteLibrary"
        >
        </dms-library-item>
      </div>

      <div class="dms-library-baseline" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { DmsLibraryItem, DmsLibraryInfo } from "@/views/library";
import { Status } from "@/models/common";
import { MenuItem } from "@/models/menu";
import { LibraryAddItem, LibraryItem } from "@/models/library";
import Vue from "vue";
export default Vue.extend({
  name: "DmsLibrary",

  props: {},

  // beforeCreate() {},

  async created() {
    this.$q.loading.show();

    // 获取 library 数据
    const [_, res] = await this.$s.GetLibraries();
    this.libraries = res?.data ?? [];

    this.$q.loading.hide();
  },

  // beforeMount() {},

  // mounted() {},

  // beforeDestroy() {},

  // destroyed() {},

  data() {
    return {
      libraries: [] as LibraryItem[]
    };
  },

  computed: {
    menu(): MenuItem[] {
      return [
        {
          name: "新建",
          show: this.$u.hasRole("library.create"),
          children: [
            {
              name: "新建资料库",
              action: this.handleCreateLibrary
            }
          ]
        }
      ];
    }
  },

  watch: {},

  methods: {
    handleCreateLibrary() {
      this.$q
        .dialog({
          component: DmsLibraryInfo,
          parent: this,
          library: new Object() as LibraryItem,
          isNew: true
        })
        .onOk(async (library: LibraryItem) => {
          const userId = this.$q.localStorage.getItem<number>(
            this.$v.keys.userId
          );

          // 只有读取到了 userId，才添加
          if (!userId) {
            this.$pw.toast("未获取到用户信息，请重新尝试。", "warning");
            return;
          }

          this.$q.loading.show();

          // 新建，填上创建者
          library.creatorId = userId;

          const [_, res] = await this.$s.CreateLibrary(
            library as LibraryAddItem
          );
          if (res && res.status === Status.OK) {
            this.libraries.push(res.data);
            this.$pw.toast("创建成功", "success");
          }

          this.$q.loading.hide();
        })
        .onCancel(() => {});
    },

    handleUpdateLibrary(library: LibraryItem) {
      const index = this.libraries.findIndex(x => x.id === library.id);
      this.libraries.splice(index, 1, library);
    },

    handleDeleteLibrary(id: number) {
      const index = this.libraries.findIndex(x => x.id === id);
      this.libraries.splice(index, 1);
    }
  },

  components: {
    DmsLibraryItem
  }
});
</script>

<style lang="stylus" scoped>
.dms-library-baseline
  position absolute
  height 2px
  width 100%
  box-shadow 0 0 10px 10px lightgrey
  border-radius 50%
  background lightgrey
  transform translateY(80px)

.dms-library-container
  transform translateY(-100px)
  perspective 2000px
  -webkit-perspective 2000px
  -moz-perspective 2000px

  &:hover
    .dms-library-card
      width 100px
      transform rotateY(50deg)

  .dms-library-card
    transition all 0.5s
    position relative
    width 100px
    height 300px
    margin-right 4px
    border-radius 4px
    overflow hidden
    transform-style preserve-3d
    -webkit-transform-style preserve-3d
    -moz-transform-style preserve-3d
    backface-visibility hidden
    -webkit-backface-visibility hidden
    -moz-backface-visibility hidden

    &:hover
      width 300px
      transform rotateY(0deg)

      ~ .dms-library-card
        width 100px
        backface-visibility hidden
        transform rotateY(-50deg)
</style>
