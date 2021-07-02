<template>
  <q-dialog persistent ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <dms-common-panel>
        <dms-item-header bordered bold sticky title="移动到..." />

        <div class="q-pa-md q-gutter-y-md">
          <q-list dense>
            <q-item>
              <q-item-section avatar>移动到</q-item-section>
              <q-item-section>
                {{ path.map(x => x.name).join(" > ") }}
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-tree
                  default-expand-all
                  ref="tree"
                  node-key="id"
                  label-key="name"
                  selected-color="primary"
                  :nodes="nodes"
                  :selected.sync="selectedKey"
                  @lazy-load="onLoadNode"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </dms-common-panel>

      <!-- 按钮 -->
      <q-card-actions align="right">
        <q-btn outline color="cancel" label="取消" @click="handleCancel" />
        <q-btn
          color="primary"
          label="确定"
          :disable="!canMove"
          @click="handleOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { DmsCommonPanel, DmsItemHeader } from "@/components";
import { DataItem } from "@/models/data";
import {
  Status,
  CustomVueComponent,
  LoadNodeParam,
  QuasarTreeNode
} from "@/models/common";
import { LibraryItem } from "@/models/library";

interface DataMoveTreeNode extends DataItem, LibraryItem {
  lazy: boolean;
  children: Array<DataMoveTreeNode>;
}

export default Vue.extend({
  name: "DmsMoveItems",

  props: {
    selectedList: Array as PropType<Array<DataItem>>,
    default: []
  },

  async created() {
    this.$q.loading.show();

    const [_, res] = await this.$s.GetLibraries();
    if (res) {
      const nodes = res.data as Array<DataMoveTreeNode>;
      this.nodes = nodes.map(x => {
        return {
          ...x,
          lazy: true
        };
      });
    }

    this.$q.loading.hide();
  },

  data() {
    return {
      nodes: [] as DataMoveTreeNode[],
      selectedKey: -1,
      path: [] as DataMoveTreeNode[],
      canMove: false
    };
  },

  watch: {
    selectedKey(nv) {
      let node = null;
      if (nv) {
        node = (this.$refs.tree as QuasarTreeNode<
          DataMoveTreeNode
        >).getNodeByKey(nv);
      }
      this.path = [];
      this.hanldleSelectedNode(node);
    }
  },

  methods: {
    /**
     * 懒加载子项
     */
    async onLoadNode({
      node,
      key,
      done,
      fail
    }: LoadNodeParam<DataMoveTreeNode>) {
      let libId = -1;
      let pid = 0;
      // 首层是 LibraryItem 类型，没有 type 字段
      if (node.type === void 0) {
        libId = node.id;
        pid = 0;
      } else {
        libId = node.libraryId;
        pid = node.id;
      }

      const [e, r] = await this.$s.GetData(libId, pid);

      if (e || !r || r.status !== Status.OK) {
        fail();
        return;
      }

      done(
        r.data
          .filter(x => ["folder"].includes(x.type))
          .map(x => {
            return {
              ...x,
              lazy: true
            };
          })
      );
    },

    /**
     * 选择一个节点
     */
    hanldleSelectedNode(node: DataMoveTreeNode | null) {
      if (!node) {
        this.canMove = false;
        return;
      }

      // 先把资料库对象存进路径
      const libId = node.type === void 0 ? node.id : node.libraryId;
      this.path.push(this.nodes.find(x => x.id === libId) as DataMoveTreeNode);

      // 查看要移动的文件夹是否在当前要保存的路径上，如果是，禁止移动
      // 使用 type 字段是否存在来判断是否为顶层
      if (node.type !== void 0) {
        const folders = this.selectedList
          .filter(x => ["folder"].includes(x.type))
          .map(x => x.id);

        let id = node.id;

        while (id !== 0) {
          const n = (this.$refs.tree as QuasarTreeNode<
            DataMoveTreeNode
          >).getNodeByKey(id);

          this.path.splice(1, 0, n);

          if (folders.includes(id)) {
            this.canMove = false;
            this.$pw.toast("不能移动到当前路径", "warning");
            return;
          }

          id = n.parentId;
        }
      }

      this.canMove = true;
    },

    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    show() {
      (this.$refs.dialog as CustomVueComponent).show();
    },

    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide() {
      (this.$refs.dialog as CustomVueComponent).hide();
    },

    onDialogHide() {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit("hide");
    },

    handleOK() {
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok", this.path.pop());
      // 或带有有效负载：this.$emit('ok', { ... })

      // 然后隐藏对话框
      this.hide();
    },

    handleCancel() {
      // 我们只需要隐藏对话框
      this.hide();
    }
  },

  components: {
    DmsCommonPanel,
    DmsItemHeader
  }
});
</script>

<style lang="stylus" scoped></style>
