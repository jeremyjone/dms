<template>
  <q-dialog persistent ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <dms-common-panel>
        <dms-item-header
          bordered
          bold
          :title="isNew ? '创建新的资料库' : '修改资料库信息'"
        />

        <q-list>
          <q-item clickable class="cursor-inherit">
            <q-item-section avatar>封面</q-item-section>
            <q-item-section class="dms-clear-flex">
              <dms-image-uploader
                ref="uploader"
                label="更换封面"
                size="100px"
                :url="$s.UPLOAD.UPLOAD_LIBRARY_COVER"
                :image="tmpLibrary.thumbnail"
                @rejected="handleUploadRejected"
                @succeed="handleUploadSucceed"
                @failed="handleUploadFailed"
              />
            </q-item-section>
          </q-item>

          <q-item clickable class="q-py-none">
            <!-- 名称 -->
            <q-item-section avatar> 名称 </q-item-section>

            <q-item-section>
              <q-input
                dense
                v-model="tmpLibrary.name"
                maxlength="64"
                ref="name"
                :readonly="!isNew"
                :rules="[val => !!val || '*必填*']"
              />
            </q-item-section>
          </q-item>

          <!-- 描述 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar> 描述 </q-item-section>

            <q-item-section>
              <q-input
                dense
                ref="description"
                maxlength="100"
                v-model="tmpLibrary.description"
                :rules="[val => !!val || '*必填*']"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </dms-common-panel>

      <!-- 按钮 -->
      <q-card-actions align="right">
        <q-btn
          v-if="!isNew"
          color="negative"
          label="删除"
          @click="onClickDelete"
        />

        <q-space />

        <q-btn outline color="cancel" label="取消" @click="handleCancel" />
        <q-btn color="primary" label="确定" @click="handleOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { DmsCommonPanel, DmsItemHeader, DmsImageUploader } from "@/components";
import { LibraryItem } from "@/models/library";
import { Status, CustomVueComponent } from "@/models/common";

export default Vue.extend({
  name: "DmsLibraryInfo",

  props: {
    library: {
      type: Object as PropType<LibraryItem>,
      required: true
    },
    isNew: {
      type: Boolean,
      default: false,
      required: false
    },

    deleteFn: {
      type: Function,
      default: () => {
        return void 0;
      }
    }
  },

  created() {
    this.tmpLibrary = { ...this.library };
  },

  beforeDestroy() {
    this.tmpLibrary = new Object() as LibraryItem;
  },

  data() {
    return {
      tmpLibrary: new Object() as LibraryItem
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
      if (!this.tmpLibrary.name) {
        (this.$refs.dialog as CustomVueComponent).shake();
        (this.$refs.name as CustomVueComponent).focus();
        return;
      }

      if (!this.tmpLibrary.description) {
        (this.$refs.dialog as CustomVueComponent).shake();
        (this.$refs.description as CustomVueComponent).focus();
        return;
      }

      // 检查 thumbnail
      if (!this.tmpLibrary.thumbnail) {
        this.tmpLibrary.thumbnail = "";
      }

      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok", this.tmpLibrary);
      // 或带有有效负载：this.$emit('ok', { ... })

      // 然后隐藏对话框
      this.hide();
    },

    handleCancel() {
      // 我们只需要隐藏对话框
      this.hide();
    },

    async handleDelete() {
      const [_, res] = await this.$s.DeleteLibrary(this.library.id);
      if (res && res.status === Status.OK) {
        this.deleteFn();
        this.hide();
        this.$pw.toast("删除成功");
      }
    },

    onClickDelete() {
      // 删除
      this.$q
        .dialog({
          title: "警告",
          message: "是否确定删除该资料库？ 删除后内容无法找回。",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.handleDelete();
        });
    },

    handleUploadRejected({ file, err }: { file: File; err: string }) {
      this.$pw.toast(err, "warning");
    },

    async handleUploadSucceed({
      files,
      data
    }: {
      files: File[];
      data: string;
    }) {
      this.$set(this.tmpLibrary, "thumbnail", data);
      (this.$refs.uploader as CustomVueComponent).hide();
    },

    handleUploadFailed({ files, err }: { files: File[]; err: object }) {
      this.$pw.toast(err.toString(), "error");
    }
  },

  components: {
    DmsCommonPanel,
    DmsItemHeader,
    DmsImageUploader
  }
});
</script>

<style lang="stylus" scoped></style>
