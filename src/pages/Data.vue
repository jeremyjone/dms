<template>
  <q-page
    @click="handleClickPage"
    @mousedown.native="() => $refs.switchFab.hide()"
    @mousewheel="e => e.shiftKey && setIconSize(iconSize + e.wheelDelta / 12)"
  >
    <slot name="toolbar" :menu="menu" :content="content" />

    <div
      class="absolute-top-left q-mt-lg q-pt-md q-ml-md q-gutter-x-sm"
      :style="{ 'z-index': 2 }"
      @click.stop
    >
      <!-- 库导航 -->
      <q-fab
        ref="switchFab"
        icon="apps"
        direction="down"
        padding="4px"
        @mousedown.stop
      >
        <q-fab-action
          padding="4px"
          square
          v-for="library in libraries"
          :key="library.id"
          :color="libraryId === library.id ? 'secondary' : 'primary'"
          :label="library.name"
          @click="() => switchLibrary(library)"
        />
      </q-fab>

      <!-- 根目录 -->
      <q-btn
        dense
        rounded
        icon="home"
        :disable="parentId === 0"
        :style="{ color: parentId === 0 ? 'lightgrey' : '' }"
        @click="handleHome"
      />

      <!-- 后退 -->
      <q-btn
        dense
        rounded
        icon="arrow_back"
        :disable="routeStack.empty()"
        :style="{ color: routeStack.empty() ? 'lightgrey' : '' }"
        @click="handleBack"
      />

      <!-- 前进 -->
      <q-btn
        dense
        rounded
        icon="arrow_forward"
        :disable="routeStack.full()"
        :style="{ color: routeStack.full() ? 'lightgrey' : '' }"
        @click="handleForward"
      />

      <!-- 刷新 -->
      <q-btn dense rounded icon="refresh" @click="getData" />
    </div>

    <transition-group
      tag="div"
      enter-active-class="animate__animated animate__zoomIn"
      leave-active-class="animate__animated animate__zoomOut absolute"
      class="scroll q-ma-none q-py-lg dms-body-height-none-with-bar"
      :class="{
        'q-gutter-md': showMode === 'icon',
        'q-pa-sm q-pt-xl': showMode === 'list'
      }"
      :duration="100"
    >
      <dms-data-item
        v-for="data in allData.filter(x =>
          showMyFile ? x.creatorId === userId : true
        )"
        :key="data.id"
        :mode="showMode"
        :data="data"
        :size="iconSize"
        :select="selected && data.id === selected.id"
        :context-menu="itemHandleMenu"
        :draggable="$u.hasRole('data.edit')"
        :showModeConfig="showModeConfig"
        :selectMany="selectMany"
        :checked="selectedList.filter(x => x.id === data.id).length > 0"
        @click="handleClickItem"
        @dblclick="handleDblClickItem"
        @move="handleDragItem"
        @checkout="handleCheckout"
      />
    </transition-group>

    <p v-if="allData.length === 0" class="absolute-center text-h4">空空如也</p>

    <!-- 右键菜单 -->
    <dms-menu touch-position context-menu :menu="contextMenus" />

    <!-- 多选时的侧边栏 -->
    <q-dialog
      seamless
      v-model="sidebar"
      transition-show="jump-down"
      transition-hide="jump-up"
      :position="sidebarPos"
    >
      <q-card
        class="relative-position"
        v-touch-swipe.mouse="swipeSidebar"
        :style="{ 'min-width': '400px', cursor: 'move' }"
        @click.stop="() => (showSidebarArrow = !showSidebarArrow)"
      >
        <q-card-section
          class="row items-center no-wrap"
          v-for="item in selectedList"
          :key="item.id"
        >
          <strong>{{ getFilename(item) }}</strong>

          <q-space />

          <q-btn
            dense
            flat
            round
            icon="close"
            @touchstart.stop
            @mousedown.stop
            @click.stop="() => handleCheckout(item, false)"
          />
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-btn
                  label="移动到..."
                  color="primary"
                  @touchstart.stop
                  @mousedown.stop
                  @click.stop="handleMoveItems"
                />
              </q-item-section>

              <q-item-section>
                <q-btn
                  label="清空"
                  color="negative"
                  @touchstart.stop
                  @mousedown.stop
                  @click.stop="clearSelectedList"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <transition
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        >
          <div
            v-show="showSidebarArrow"
            class="fit absolute-center no-pointer-events"
          >
            <div
              v-for="btn in [
                {
                  pos: 'top',
                  icon: 'arrow_upward',
                  style: { top: '22px' },
                  to: 'top'
                },
                {
                  pos: 'left',
                  icon: 'arrow_back',
                  style: { left: '22px' },
                  to: 'left'
                },
                {
                  pos: 'bottom',
                  icon: 'arrow_downward',
                  style: { top: '-22px' },
                  to: 'bottom'
                },
                {
                  pos: 'right',
                  icon: 'arrow_forward',
                  style: { left: '-22px' },
                  to: 'right'
                }
              ]"
              :key="btn.pos"
              :class="`absolute-${btn.pos}`"
            >
              <q-btn
                round
                color="accent"
                class="absolute-center all-pointer-events"
                :icon="btn.icon"
                :style="btn.style"
                @click.stop="() => (sidebarPos = btn.to)"
              />
            </div>
          </div>
        </transition>
      </q-card>
    </q-dialog>

    <!-- 隐式上传组件 -->
    <dms-uploader
      ref="uploader"
      :url="$s.UPLOAD.UPLOAD_DATA_FILE"
      :label="
        `${
          isCreateNewData ? '上传资料内容' : '更新 ' + getFilename() + ' 内容'
        }`
      "
      :maxCount="uploadCount"
      :maxFileSize="209715200"
      :form-fields="[
        { name: 'libraryId', value: libraryId },
        { name: 'path', value: routeStack.contentWithoutLibrary.join(',') }
      ]"
      @succeed="handleUploadSucceed"
      @failed="handleUploadFailed"
      @rejected="handleUploadRejected"
    />
  </q-page>
</template>

<script lang="ts">
import Vue from "vue";
import {
  DataItem,
  DataAddItem,
  DataShowModeConfig,
  DataShowMode,
  DataUpdateItem,
  DataShowModeConfigKey,
  DEFAULT_DATA_SHOW_MODE_CONFIG
} from "@/models/data";
import { MenuItem } from "@/models/menu";
import { DmsUploader, DmsMenu } from "@/components";
import { Status, Uploader } from "@/models/common";
import { download } from "@/api/server";
import { FileItem } from "@/models/file";
import { LibraryItem } from "@/models/library";
import { clone } from "@/tools";

import {
  DmsDataItem,
  DmsFileInfo,
  DmsFolderInfo,
  DmsMoveItems,
  DmsVersionComment
} from "@/views/data";

interface Path {
  id: number;
  name: string;
}

class PathStack {
  private cursor = -1;
  private stack = [] as Path[];

  get length() {
    return this.stack.length;
  }

  get content() {
    return this.stack.slice(0, this.cursor + 1).map(x => x.name);
  }

  get contentWithoutLibrary() {
    if (this.cursor === 0) return [];
    return this.stack.slice(1, this.cursor + 1).map(x => x.name);
  }

  empty() {
    return this.cursor === 0;
  }

  full() {
    return this.cursor === this.stack.length - 1;
  }

  push(path: Path) {
    if (++this.cursor < this.stack.length) {
      this.stack.length = this.cursor;
    }
    this.stack.push(path);
  }

  back() {
    if (this.cursor > 0) {
      return this.stack[--this.cursor];
    }
  }

  forward() {
    if (this.cursor < this.length - 1) {
      return this.stack[++this.cursor];
    }
  }

  clear() {
    this.stack = [];
    this.cursor = -1;
  }
}

export default Vue.extend({
  name: "DmsData",

  async created() {
    this.$q.loading.show();

    // 获取显示方式
    this.showMode =
      this.$q.localStorage.getItem<DataShowMode>(this.$v.keys.asShow) ?? "icon";
    const _config = this.$q.localStorage.getItem<DataShowModeConfig>(
      this.$v.keys.asShowConfig
    );

    _config && Object.assign(this.showModeConfig, _config);

    this.userId =
      this.$q.localStorage.getItem<number>(this.$v.keys.userId) ?? -1;

    const iconSize =
      this.$q.localStorage.getItem<number>(this.$v.keys.asShowIconSize) ?? 100;
    this.setIconSize(10 < iconSize ? iconSize : 10);

    this.libraryId = parseInt(this.$route.query.id as string);

    // 获取 library 数据
    const [_, resLib] = await this.$s.GetLibraries();
    this.libraries = resLib?.data ?? [];
    const lib = this.libraries.find(x => x.id === this.libraryId);

    lib && this.init(lib, false);

    this.$q.loading.hide();
  },

  // beforeMount() {},

  // mounted() {},

  // beforeDestroy() {},

  // destroyed() {},

  data() {
    return {
      userId: -1,
      parentId: 0,
      libraryId: -1,
      libraries: [] as LibraryItem[],
      selected: null as null | DataItem,
      selectedList: [] as DataItem[],
      selectMany: false,
      uploadCount: 1,
      isCreateNewData: true,
      allData: [] as DataItem[],
      routeStack: new PathStack(),
      showMyFile: false,
      showMode: "icon" as DataShowMode,
      showModeConfig: DEFAULT_DATA_SHOW_MODE_CONFIG,
      sidebar: false,
      sidebarPos: "bottom",
      showSidebarArrow: false,
      iconSize: 100
    };
  },

  computed: {
    content(): string {
      const path = this.routeStack.content.join(" > ");

      return `${path} ${this.getFilename() ? "> " + this.getFilename() : ""}`;
    },

    selectManyMenu(): MenuItem {
      return {
        name: "多选",
        icon: this.selectMany ? "check" : "",
        show: this.$u.hasRole("data.edit"),
        action: () => {
          this.selectMany = !this.selectMany;
          this.selectedList.length = 0;
        }
      };
    },

    createMenu(): MenuItem[] {
      return [
        {
          name: "新建文件夹",
          action: this.handleCreateFolder
        },
        {
          name: "上传资料内容",
          action: this.handleCreateFile
        }
      ];
    },

    itemHandleMenu(): MenuItem[] {
      const isFolder = ["folder"].includes(this.selected?.type ?? "");

      return [this.selectManyMenu].concat(
        this.hasJurisdiction
          ? [
              {
                name: "修改文件夹信息",
                show: isFolder,
                action: this.handleUpdateFolderInfo
              },
              {
                name: "更新资料内容",
                show: !isFolder || this.selected?.id === void 0,
                action: this.handleUpdateDataItem
              },
              {
                separator: true
              },
              {
                name: "删除",
                action: this.handleDeleteItem
              }
            ]
          : []
      );
    },

    menu(): MenuItem[] {
      const listMenu: MenuItem[] = [
        {
          name: "显示大小",
          icon: this.showModeConfig.size ? "check" : "",
          action: () => this.changeShowModeItem("size")
        },
        {
          name: "显示更新者",
          icon: this.showModeConfig.updator ? "check" : "",
          action: () => this.changeShowModeItem("updator")
        },
        {
          name: "显示创建者",
          icon: this.showModeConfig.creator ? "check" : "",
          action: () => this.changeShowModeItem("creator")
        },
        {
          name: "显示更新日期",
          icon: this.showModeConfig.updatedate ? "check" : "",
          action: () => this.changeShowModeItem("updatedate")
        },
        {
          name: "显示创建日期",
          icon: this.showModeConfig.createdate ? "check" : "",
          action: () => this.changeShowModeItem("createdate")
        }
      ];

      const iconMenu: MenuItem[] = [
        {
          name: "显示超小图标",
          icon: this.iconSize === 30 ? "check" : "",
          action: () => this.setIconSize(30)
        },
        {
          name: "显示小图标",
          icon: this.iconSize === 50 ? "check" : "",
          action: () => this.setIconSize(50)
        },
        {
          name: "显示中图标",
          icon: this.iconSize === 75 ? "check" : "",
          action: () => this.setIconSize(75)
        },
        {
          name: "显示大图标",
          icon: this.iconSize === 100 ? "check" : "",
          action: () => this.setIconSize(100)
        },
        {
          name: "显示超大图标",
          icon: this.iconSize === 150 ? "check" : "",
          action: () => this.setIconSize(150)
        },
        {
          name: "其他尺寸图标(Shift + 滚动)",
          icon: ![30, 50, 75, 100, 150].includes(this.iconSize) ? "check" : ""
        }
      ];

      return [
        {
          name: "创建",
          show: this.$u.hasRole("data.create"),
          children: this.createMenu
        },
        {
          name: "编辑",
          show: this.$u.hasRole("data.edit"),
          children: this.itemHandleMenu.concat([
            {
              name: "移动到...",
              show: this.selectedList.length > 0,
              action: this.handleMoveItems
            }
          ])
        },
        {
          name: "查看",
          children: ([
            {
              name: "刷新",
              action: this.getData
            },
            {
              separator: true
            },
            {
              name: "只显示我的文件",
              icon: this.showMyFile ? "check" : "",
              action: () => {
                this.showMyFile = !this.showMyFile;
                this.selectedList.length = 0;
              }
            },
            {
              separator: true
            },
            {
              name: "按图标排列",
              icon: this.showMode === "icon" ? "check" : "",
              action: () => this.changeShowMode("icon")
            },
            {
              name: "按列表排列",
              icon: this.showMode === "list" ? "check" : "",
              action: () => this.changeShowMode("list")
            },
            {
              separator: true
            },
            {
              name: "显示自定义图标",
              icon: this.showModeConfig.customIcon ? "check" : "",
              action: () => this.changeShowModeItem("customIcon")
            }
          ] as MenuItem[]).concat(
            this.showMode === "list" ? listMenu : iconMenu
          )
        }
      ];
    },

    contextMenus(): MenuItem[] {
      const menus = [] as MenuItem[];

      this.$u.hasRole("data.edit") &&
        menus.concat([
          this.selectManyMenu,
          {
            separator: true
          }
        ]);

      this.$u.hasRole("data.create") &&
        menus.concat(this.createMenu).push({ separator: true });

      menus.push({
        name: "刷新",
        action: this.getData
      });

      return menus;
    },

    hasJurisdiction(): boolean {
      // 获取权限，创建者 或者 leader 以上级别可以修改
      return (
        (this.selected && this.$u.hasRole("data.edit")) ||
        this.selected?.creatorId === this.userId
      );
    }
  },

  watch: {},

  methods: {
    async init(library: LibraryItem, isLoading = true) {
      this.routeStack.clear();
      this.parentId = 0;
      this.libraryId = library.id;

      this.routeStack.push({ id: 0, name: library.name });
      await this.getData(isLoading);
    },

    setIconSize(size: number) {
      // 10为最小
      if (size < 10 || size > 500) return;

      this.iconSize = size;
      this.$q.localStorage.set(this.$v.keys.asShowIconSize, size);
    },

    switchLibrary(library: LibraryItem) {
      if (library.id === this.libraryId) return;

      this.$router.push({ path: `${this.$pw.route.data}?id=${library.id}` });
      this.init(library);
    },

    handleHome() {
      this.parentId = 0;
      const library = this.libraries.find(x => x.id === this.libraryId);
      library && this.init(library);
    },

    swipeSidebar({ evt, ...info }: any) {
      switch (info.direction) {
        case "left":
          this.sidebarPos = "left";
          break;
        case "right":
          this.sidebarPos = "right";
          break;
        case "up":
          this.sidebarPos = "top";
          break;
        default:
          this.sidebarPos = "bottom";
          break;
      }
    },

    getFilename(item?: DataItem): string {
      !item && (item = this.selected as DataItem);

      // const fileType = ["folder", "file"].includes(
      //   item?.type ?? ""
      // )
      //   ? ""
      //   : `.${item?.type}`;

      // return item ? `${item?.name ?? "unknown"}${fileType}` : "";
      return item?.name ?? "";
    },

    clearSelectedList() {
      this.selectedList = [] as DataItem[];
    },

    async getData(loading = true) {
      if (loading) this.$q.loading.show();

      const [_, res] = await this.$s.GetData(this.libraryId, this.parentId);
      this.allData = res?.data ?? [];

      // 更新数据后，清空内部临时数据
      this.selectedList = [];
      this.selected = null;
      this.selectMany = false;

      if (loading) this.$q.loading.hide();
    },

    // 前进
    async handleForward() {
      const f = this.routeStack.forward();
      if (f) {
        this.parentId = f.id;
        await this.getData();
      }
    },

    // 后退
    async handleBack() {
      const b = this.routeStack.back();
      if (b) {
        this.parentId = b.id;
        await this.getData();
      }
    },

    // 切换视图
    changeShowMode(mode: DataShowMode) {
      this.$q.localStorage.set(this.$v.keys.asShow, mode);
      this.showMode = mode;

      // 切换视图，关闭多选
      this.selectMany = false;
      this.selectedList = [];
    },

    changeShowModeItem(key: DataShowModeConfigKey) {
      this.showModeConfig[key] = !this.showModeConfig[key];
      this.$q.localStorage.set(this.$v.keys.asShowConfig, this.showModeConfig);
    },

    // 多选
    handleCheckout(data: DataItem, isCheck: boolean) {
      // 如果选中，将 data 放入 selectedList 中
      // 反之，取出
      const index = this.selectedList.findIndex(x => x.id === data.id);

      if (index === -1 && isCheck) {
        this.selectedList.push(data);
      } else {
        index !== -1 && this.selectedList.splice(index, 1);
      }

      // 显示侧边栏
      this.sidebar = this.selectedList.length > 0;
    },

    // 点击页面，取消选中
    handleClickPage() {
      this.selected = null;
    },

    // 点击图标，选择资料内容
    handleClickItem(data: DataItem) {
      this.selected = data;
    },

    // 双击打开资料内容
    async handleDblClickItem(data: DataItem) {
      if (/folder/.test(data.type)) {
        this.parentId = data.id;
        this.selected = null;
        await this.getData();

        this.routeStack.push({ id: data.id, name: data.name });

        this.sidebar = false;
      } else {
        this.$q
          .dialog({
            component: DmsFileInfo,
            parent: this,
            dataId: data.id,
            pos: this.routeStack.contentWithoutLibrary,
            libraryId: this.libraryId,
            libraryName: this.routeStack.content[0],
            updateDataItem: this.handleUpdateDataItem,
            canChange: this.hasJurisdiction
          })
          .onOk(async (updateData: DataItem) => {
            // 只有读取到了 userId，才添加
            if (!this.userId) {
              this.$pw.toast("未获取到用户信息，请重新尝试。", "warning");
              return;
            }

            this.$q.loading.show();

            // 添加之后
            const [_, res] = await this.$s.UpdateDatum(data.id, updateData);
            if (res && res.status === Status.OK) {
              const index = this.allData.findIndex(x => x.id === data.id);
              this.allData.splice(index, 1, data);
              this.$pw.toast("更新成功");
            }

            this.$q.loading.hide();
          });
      }
    },

    // 拖动资料内容，移动层级位置
    async handleDragItem({
      source,
      target
    }: {
      source: number;
      target: DataItem;
    }) {
      if (source < 1) return;

      // 移动多个，需要多选，否则只移动拖动的那一个资料项
      if (this.selectedList.length > 0) {
        this.handleDragItems(target);
        return;
      }

      const data = this.allData.find(x => x.id === source);

      if (!data) {
        this.$pw.toast("未找到内容", "warning");
        return;
      }

      const updateData: DataUpdateItem = Object.create({});
      Object.assign(updateData, data);
      updateData.parentId = target.id;
      updateData.versionComment = "";

      const [, res] = await this.$s.UpdateDatum(source, updateData);

      if (res && res.status === Status.OK) {
        const index = this.allData.findIndex(x => x.id === data.id);
        this.allData.splice(index, 1);

        // 提供一个撤销移动的功能
        this.$pw.notice({
          message: `移动 ${data.name} 成功`,
          type: "success",
          okBtn: {
            name: "撤销",
            action: async () => {
              const [, res] = await this.$s.UpdateDatum(source, data);

              if (res && res.status === Status.OK) {
                this.allData.splice(index, 0, data);
                this.$pw.toast("撤销成功");
              }
            }
          },
          cancelBtn: {
            name: "关闭"
          }
        });
      } else {
        this.$pw.toast("移动失败，请重试。", "error");
      }
    },

    // 拖动多个资料内容
    async handleDragItems(target: DataItem) {
      // 先筛掉目标项，它不能放到自身的子项中，这是判断文件夹移动的
      this.selectedList = this.selectedList.filter(x => x.id !== target.id);
      await this.__moveItems(target);
    },

    // 移动资料，打开会话框，选择一个位置，然后移动。
    // 这是多选的后续操作
    handleMoveItems() {
      if (this.selectedList.length === 0) return;

      this.sidebarPos = "right";

      this.$q
        .dialog({
          component: DmsMoveItems,
          selectedList: this.selectedList,
          parent: this
        })
        .onOk(async (data: DataItem) => {
          this.$q.loading.show();

          // 通过 type 字段是否存在，判断是否为顶级
          // id -> 给出父级 id，顶层为 0
          // libraryId -> 给出资料库 id
          const target = {
            id: data.type === void 0 ? 0 : data.id,
            libraryId: data.type === void 0 ? data.id : data.libraryId
          } as DataItem;

          await this.__moveItems(target);

          this.$q.loading.hide();
        })
        .onDismiss(() => {
          this.sidebarPos = "bottom";
        });
    },

    async __moveItems(data: DataItem) {
      const itemList: DataItem[] = [];
      const originList: DataItem[] = [];
      for (let i = 0; i < this.selectedList.length; i++) {
        const originData: DataItem = Object.create({});
        Object.assign(originData, this.selectedList[i]);
        originList.push(originData);

        const updateData: DataItem = Object.create({});
        Object.assign(updateData, this.selectedList[i]);
        updateData.parentId = data.id;
        updateData.libraryId = data.libraryId;
        itemList.push(updateData);
      }

      // 清空选择列表
      this.selectedList = [] as DataItem[];

      const [, res] = await this.$s.UpdateData(
        itemList.map(x => {
          return {
            id: x.id,
            data: { ...x, versionComment: "" } as DataUpdateItem
          };
        })
      );

      if (res && res.status === Status.OK) {
        const originData = clone(this.allData);
        for (let i = 0; i < itemList.length; i++) {
          const index = this.allData.findIndex(x => x.id === itemList[i].id);
          this.allData.splice(index, 1);
        }

        // 提供一个撤销移动的功能
        this.$pw.notice({
          message: `批量移动成功`,
          type: "success",
          okBtn: {
            name: "撤销",
            action: async () => {
              const [, res] = await this.$s.UpdateData(
                originList.map(x => {
                  return {
                    id: x.id,
                    data: {
                      ...x,
                      libraryId: itemList[0].libraryId,
                      versionComment: ""
                    } as DataUpdateItem
                  };
                })
              );

              if (res && res.status === Status.OK) {
                this.allData = clone(originData);
                this.$pw.toast("撤销成功");
              }
            }
          },
          cancelBtn: {
            name: "关闭"
          }
        });
      } else {
        this.$pw.toast("移动失败，请重试。", "error");
      }
    },

    handleCreateFolder() {
      this.$q
        .dialog({
          component: DmsFolderInfo,
          parent: this,
          data: new Object() as DataItem,
          isNew: true
        })
        .onOk(async (data: DataItem) => {
          // 只有读取到了 userId，才添加
          if (!this.userId) {
            this.$pw.toast("未获取到用户信息，请重新尝试。", "warning");
            return;
          }

          this.$q.loading.show();

          // 添加新建的属性
          data.creatorId = this.userId;
          data.libraryId = this.libraryId;
          data.parentId = this.parentId;

          const [_, res] = await this.$s.CreateDatum(data);
          if (res && res.status === Status.OK) {
            this.allData.push(res.data);
            this.$pw.toast("创建成功");
          }

          this.$q.loading.hide();
        });
    },

    handleCreateFile() {
      this.uploadCount = 5;
      this.isCreateNewData = true;
      (this.$refs.uploader as Uploader).show();
    },

    handleUpdateDataItem() {
      this.uploadCount = 1;
      this.isCreateNewData = false;
      (this.$refs.uploader as Uploader).show();
    },

    handleUpdateFolderInfo() {
      if (!this.selected) return;

      const index = this.allData.findIndex(x => x.id === this.selected?.id);

      this.$q
        .dialog({
          component: DmsFolderInfo,
          parent: this,
          data: this.allData[index]
        })
        .onOk(async (data: DataItem) => {
          // 只有读取到了 userId，才添加
          if (!this.userId) {
            this.$pw.toast("未获取到用户信息，请重新尝试。", "warning");
            return;
          }

          this.$q.loading.show();

          // 修改文件夹的属性
          data.parentId = this.parentId;

          // console.log("OK", emp);
          const [_, res] = await this.$s.UpdateDatum(
            data.id,
            data as DataUpdateItem
          );
          if (res && res.status === Status.OK) {
            this.allData.splice(index, 1, res.data);
            this.$pw.toast("修改成功");
          }

          this.$q.loading.hide();
        });
    },

    // 删除资料内容
    handleDeleteItem() {
      const index = this.allData.findIndex(x => x.id === this.selected?.id);

      // 没有选择的时候，什么都不做
      if (index === -1 && this.selectedList.length === 0) return;

      this.$q
        .dialog({
          title: "确认删除",
          message:
            "确认删除 " +
            (this.selectedList.length === 0
              ? this.allData[index].name + " 吗？"
              : this.selectedList.length + " 项吗？"),
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.__deleteItem(index);
        });
    },

    async __deleteItem(index: number) {
      // 删除一项
      if (this.selectedList.length === 0) {
        const [_, res] = await this.$s.DeleteDatum(this.selected?.id ?? -1);
        if (res && res.status === Status.OK) {
          this.allData.splice(index, 1);
          this.$pw.toast("删除成功");
        }
      } else {
        // 删除多项
        const [_, res] = await this.$s.DeleteData(
          this.selectedList.map(x => x.id)
        );
        if (res && res.status === Status.OK) {
          for (let i = 0; i < this.selectedList.length; i++) {
            const _idx = this.allData.findIndex(
              x => x.id === this.selectedList[i].id
            );
            this.allData.splice(_idx, 1);
          }
          this.$pw.toast("删除成功");
        }
      }
    },

    // 大文件上传，使用专用工具
    handleUploadBigFile() {
      const command =
        "dmsupload://uploadtools/" +
        `&libraryId=${this.libraryId}` +
        `&libraryName=${this.routeStack.content[0]}` +
        `&parentId=${this.parentId}` +
        `&username=${this.$q.localStorage.getItem<string>(
          this.$v.keys.username
        )}` +
        `&userId=${this.userId}` +
        `&path=${this.routeStack.contentWithoutLibrary}`;

      // 检查是否有该下载工具协议，如果没有，提示下载
      // FIXME: 有个问题，判断有了的话，也开大了上传程序，但是还是会打开安装提示
      this.$u.protocolCheck(command, () => {
        this.$q
          .dialog({
            title: "提示",
            message: "还没安装上传工具，现在下载？",
            cancel: true,
            persistent: true
          })
          .onOk(() => {
            download(
              "tools/UploadTools.msi",
              "UploadTools.msi",
              "application/octet-stream"
            );
          });
      });
    },

    // 上传成功
    async handleUploadSucceed({
      files,
      data
    }: {
      files: File[];
      data: FileItem[];
    }) {
      // 只有读取到了 userId，才添加
      if (!this.userId) {
        this.$pw.toast("未获取到用户信息，请重新尝试。", "warning");
        return;
      }

      if (this.isCreateNewData) {
        // 上传成功，在当前目录下添加文件
        const dataList = [] as DataAddItem[];

        data.forEach(item => {
          const filename = item.path.split("\\")?.pop() ?? "unknown";
          dataList.push({
            name: item.originName,
            description: "",
            thumbnail: "",
            fileId: item.id,
            type: filename.split(".").pop() ?? "unknown",
            libraryId: this.libraryId,
            parentId: this.parentId,
            creatorId: this.userId,
            versionComment: "Init upload"
          });
        });

        const [_, res] = await this.$s.CreateData(dataList);
        if (res && res.status === Status.OK) {
          this.allData = this.allData.concat(res.data);
          this.$pw.toast("创建成功");
        }
      } else {
        // 更新资料内容
        if (data.length > 0) {
          const index = this.allData.findIndex(x => x.id === this.selected?.id);
          const filename = data?.[0].path.split("\\")?.pop() ?? "unknown";
          this.allData[index].fileId = data?.[0].id;
          this.allData[index].name = data?.[0].originName ?? filename;
          this.allData[index].type = filename.split(".").pop() ?? "unknown";

          // 填写更新备注信息
          this.$q
            .dialog({
              component: DmsVersionComment,
              parent: this,
              persistent: true
            })
            .onOk(async (comment: string) => {
              const [_, res] = await this.$s.UpdateDatum(
                this.allData[index].id,
                {
                  ...this.allData[index],
                  versionComment: comment
                } as DataUpdateItem
              );

              if (res && res.status === Status.OK) {
                this.allData.splice(index, 1, res.data);
                this.$pw.toast("更新成功");
              }
            });
        }
      }

      // 关闭对话框
      (this.$refs.uploader as Uploader).hide();
    },

    // 上传失败
    handleUploadFailed({ files, err }: { files: File[]; err: object }) {
      this.$pw.toast(err.toString(), "error");
    },

    handleUploadRejected({
      file,
      type,
      err
    }: {
      file: File;
      type: string;
      err: object;
    }) {
      if (type === "size") {
        // 超过大小限制
        this.$q
          .dialog({
            title: "提示",
            message: "文件太大，请使用专用的上传工具，点击确定打开。",
            cancel: true,
            persistent: true
          })
          .onOk(() => {
            this.handleUploadBigFile();
            (this.$refs.uploader as Uploader).hide();
          });
      }
    }
  },

  components: {
    DmsDataItem,
    DmsUploader,
    DmsMenu
  }
});
</script>

<style lang="stylus" scoped></style>
