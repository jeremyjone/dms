<template>
  <q-uploader
    ref="uploader"
    class="hidden"
    :accept="fileType"
    :multiple="maxCount > 1"
    :max-files="maxCount"
    :url="url"
    :headers="[
      {
        name: 'Authorization',
        value: 'Bearer ' + $store.state.user.token
      }
    ]"
    :factory="factory"
    @rejected="handleUploadRejected"
    @uploaded="handleUploaded"
    @failed="handleUploadFailed"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Response, Uploader } from "@/models/common";

export default Vue.extend({
  name: "DmsHiddenUploadComponent",

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

    factory: {
      type: Function,
      default: () => {
        return {};
      }
    }
  },

  methods: {
    // 对外暴露，添加文件操作，自动上传
    add(files: File[]) {
      (this.$refs.uploader as Vue & {
        addFiles: (files: File[]) => void;
      }).addFiles(files);
      (this.$refs.uploader as Uploader).upload();
    },

    handleUploadRejected(
      rejectedEntries: Array<{ failedPropValidation: string; file: File }>
    ) {
      rejectedEntries.forEach(item => {
        if (item.failedPropValidation === "accept") {
          this.$emit("rejected", {
            file: item.file,
            err: `${item.file.name} 类型不符，只能上传 ${this.fileType} 的类型。`
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
        (this.$refs.uploader as Uploader).reset();
      } else {
        const err = res.data;
        this.$emit("failed", { files, err });
        (this.$refs.uploader as Uploader).reset();
      }
    },

    handleUploadFailed({ files, xhr }: { files: File[]; xhr: XMLHttpRequest }) {
      if (xhr.status === 0) {
        this.$emit("failed", { files, err: "已取消" });
        (this.$refs.uploader as Uploader).reset();
      } else if (xhr.response === "") {
        this.$emit("failed", { files, err: "空值" });
      } else {
        const res = JSON.parse(xhr.response) as Response<object>;
        const err = res.data;
        this.$emit("failed", { files, err });
        (this.$refs.uploader as Uploader).reset();
      }
    }
  }
});
</script>

<style lang="stylus" scoped></style>
