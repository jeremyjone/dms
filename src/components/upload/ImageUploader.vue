<template>
  <div
    class="overflow-hidden"
    :style="{ border: '1px dashed', 'border-radius': '5px' }"
  >
    <q-avatar
      square
      class="cursor-pointer"
      :size="size"
      @click="handleUploadShow"
      @mouseenter="() => (isHover = true)"
      @mouseleave="() => (isHover = false)"
    >
      <q-img v-if="!!image" :src="require(`@/assets/images/test/${image}`)" />
      <q-icon v-show="!image" name="add" />

      <transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
      >
        <div
          v-show="isHover"
          class="absolute fit"
          :style="{ 'background-color': '#999A' }"
        >
          <q-icon name="add" class="absolute-center" />
        </div>
      </transition>
    </q-avatar>

    <dms-uploader
      ref="uploader"
      :label="label"
      :url="url"
      :maxCount="maxCount"
      :fileType="fileType"
      :form-fields="formFields"
      @rejected="handleUploadRejected"
      @succeed="handleUploadSucceed"
      @failed="handleUploadFailed"
    />
  </div>
</template>

<script lang="ts">
import { CustomVueComponent } from "@/models/common";
import Vue from "vue";
import DmsUploader from "./Uploader.vue";

export default Vue.extend({
  name: "DmsImageUploaderComponent",

  props: {
    image: {
      type: String,
      default: ""
    },

    size: {
      type: String,
      default: "100px"
    },

    url: {
      type: String,
      default: "",
      required: true
    },

    label: {
      type: String,
      default: "上传文件",
      required: false
    },

    fileType: {
      type: String,
      default: ".jpeg,.jpg,.png",
      required: false
    },

    maxCount: {
      type: Number,
      default: 1,
      required: false
    },

    formFields: {
      type: Array,
      default: () => [{ name: "type", value: "image" }]
    }
  },

  data() {
    return {
      isHover: false
    };
  },

  computed: {},

  watch: {},

  methods: {
    handleUploadShow() {
      (this.$refs.uploader as CustomVueComponent).show();
    },

    handleUploadRejected({ file, err }: { file: File; err: string }) {
      this.$emit("rejected", { file, err });
    },

    async handleUploadSucceed({
      files,
      data
    }: {
      files: File[];
      data: { path: string };
    }) {
      this.$emit("succeed", { files, data });
    },

    handleUploadFailed({ files, err }: { files: File[]; err: object }) {
      this.$emit("failed", { files, err });
    },

    hide() {
      (this.$refs.uploader as CustomVueComponent).hide();
    }
  },

  components: {
    DmsUploader
  }
});
</script>

<style lang="stylus" scoped></style>
