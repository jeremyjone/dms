<template>
  <!-- 上传文件对话框 -->
  <q-dialog v-model="showUploadDialog" persistent>
    <q-card class="overflow-hidden">
      <dms-item-header bold :title="label" />

      <q-card-section class="row items-center">
        <q-uploader
          ref="uploader"
          square
          flat
          bordered
          hide-upload-btn
          batch
          :accept="fileType"
          :multiple="maxCount > 1"
          :max-files="maxCount"
          :max-file-size="maxFileSize"
          :label="label"
          :url="url"
          :headers="[
            {
              name: 'Authorization',
              value: 'Bearer ' + $store.state.user.token
            }
          ]"
          :form-fields="formFields"
          @added="handleUploadAdded"
          @removed="handleUploadRemoved"
          @rejected="handleUploadRejected"
          @uploaded="handleUploaded"
          @failed="handleUploadFailed"
        />
      </q-card-section>

      <q-card-actions align="right">
        <span class="q-ml-md">{{ currentFileCount }} / {{ maxCount }}</span>

        <q-space />

        <q-btn outline label="取消" color="cancel" v-close-popup />
        <q-btn label="确定" color="primary" @click="handleUploadStart" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import DmsItemHeader from "../common/ItemHeader.vue";
import { Response, Uploader } from "@/models/common";

export default Vue.extend({
  name: "DmsCommonUploadDialog",

  props: {
    url: {
      type: String,
      required: true
    },

    label: {
      type: String,
      default: "上传文件",
      required: false
    },

    fileType: {
      type: String,
      default: "*/*",
      required: false
    },

    maxCount: {
      type: Number,
      default: 1,
      required: false
    },

    maxFileSize: {
      type: Number,
      default: 1073741824 // 1G
    },

    formFields: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      showUploadDialog: false,
      currentFileCount: 0
    };
  },

  computed: {},

  watch: {},

  methods: {
    handleUploadAdded(files: File[]) {
      this.$emit("added", files);
      this.currentFileCount += files.length;
    },

    handleUploadRemoved(files: File[]) {
      this.$emit("removed", files);
      this.currentFileCount--;
    },

    handleUploadRejected(
      rejectedEntries: Array<{ failedPropValidation: string; file: File }>
    ) {
      rejectedEntries.forEach(item => {
        if (item.failedPropValidation === "accept") {
          this.$emit("rejected", {
            file: item.file,
            type: "accept",
            err: `${item.file.name} 类型不符，只能上传 ${this.fileType} 的类型。`
          });
        } else if (item.failedPropValidation === "max-file-size") {
          this.$emit("rejected", {
            file: item.file,
            type: "size",
            err: `${item.file.name} 太大，无法上传。`
          });
        }
      });
    },

    handleUploaded({ files, xhr }: { files: File[]; xhr: XMLHttpRequest }) {
      if (xhr.response === "") {
        this.$emit("failed", { files, err: "空值" });
        return;
      }

      const res = JSON.parse(xhr.response) as Response<object>;
      if (res.status === 1) {
        const data = res.data;
        this.$emit("succeed", { files, data });
      } else {
        const err = res.data;
        this.$emit("failed", { files, err });
      }
    },

    handleUploadFailed({ files, xhr }: { files: File[]; xhr: XMLHttpRequest }) {
      if (xhr.status === 0) {
        this.$emit("failed", { files, err: "已取消" });
      } else if (xhr.response === "") {
        this.$emit("failed", { files, err: "空值" });
      } else {
        const res = JSON.parse(xhr.response) as Response<object>;
        const err = res.data;
        this.$emit("failed", { files, err });
      }
    },

    // 点击确定，开始上传
    handleUploadStart() {
      (this.$refs.uploader as Uploader).upload();
    },

    show() {
      this.currentFileCount = 0;
      this.showUploadDialog = true;
    },

    hide() {
      this.currentFileCount = 0;
      this.showUploadDialog = false;
    }
  },

  components: {
    DmsItemHeader
  }
});
</script>

<style lang="stylus" scoped></style>
