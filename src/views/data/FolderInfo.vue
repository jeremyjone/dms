<template>
  <q-dialog persistent ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <dms-common-panel>
        <dms-item-header
          bordered
          bold
          :title="isNew ? '创建新文件夹' : '修改文件夹信息'"
        />

        <q-list>
          <q-item clickable class="q-py-none">
            <!-- 名称 -->
            <q-item-section avatar>
              名称
            </q-item-section>

            <q-item-section>
              <q-input
                dense
                v-model="tmpFolder.name"
                maxlength="20"
                ref="name"
                :rules="[val => !!val || '*必填*']"
              />
            </q-item-section>
          </q-item>

          <!-- 描述 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar>
              描述
            </q-item-section>

            <q-item-section>
              <q-input
                dense
                ref="description"
                maxlength="200"
                v-model="tmpFolder.description"
                :rules="[val => !!val || '*必填*']"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </dms-common-panel>

      <!-- 按钮 -->
      <q-card-actions align="right">
        <q-btn outline color="cancel" label="取消" @click="handleCancel" />
        <q-btn color="primary" label="确定" @click="handleOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { DmsCommonPanel, DmsItemHeader } from "@/components";
import { DataItem } from "@/models/data";
import { CustomVueComponent } from "@/models/common";

export default Vue.extend({
  name: "DmsFolderInfo",

  props: {
    data: {
      type: Object as PropType<DataItem>,
      required: true
    },

    isNew: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  created() {
    this.tmpFolder = { ...this.data };
  },

  beforeDestroy() {
    this.tmpFolder = new Object() as DataItem;
  },

  data() {
    return {
      tmpFolder: new Object() as DataItem
    };
  },

  methods: {
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
      // 按OK，在隐藏QDialog之前
      if (!this.tmpFolder.name) {
        (this.$refs.dialog as CustomVueComponent).shake();
        (this.$refs.name as CustomVueComponent).focus();
        return;
      }

      if (!this.tmpFolder.description) {
        (this.$refs.dialog as CustomVueComponent).shake();
        (this.$refs.description as CustomVueComponent).focus();
        return;
      }

      // 文件夹不需要这些属性，直接给固定属性赋值即可
      this.tmpFolder.thumbnail = "";
      this.tmpFolder.fileId = 1;
      this.tmpFolder.type = "folder";

      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok", this.tmpFolder);
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
