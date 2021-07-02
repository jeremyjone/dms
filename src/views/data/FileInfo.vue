<template>
  <q-dialog
    ref="dialog"
    class="dms-fullheight-dialog"
    position="right"
    full-height
    square
    :persistent="canChange ? true : false"
    @hide="onDialogHide"
  >
    <q-card :style="{ 'max-width': '1000px', 'min-width': '600px' }">
      <dms-common-panel>
        <dms-item-header
          height="60"
          :title="tmpData.name || ''"
          :rightBtn="{
            icon: 'close',
            action: handleCancel
          }"
        />

        <q-list>
          <!-- 名称 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar> 名称 </q-item-section>

            <q-item-section>
              <q-input
                dense
                maxlength="64"
                ref="name"
                v-model="tmpData.name"
                :readonly="!canChange"
                :rules="[val => !!val || '*必填*']"
                @blur="handleBlurFilename"
              />
            </q-item-section>

            <q-item-section side v-if="canChange">
              <q-btn
                label="更新资料"
                color="secondary"
                @click="
                  () => {
                    updateDataItem && updateDataItem();
                    handleCancel();
                  }
                "
              />
            </q-item-section>
          </q-item>

          <!-- 大小 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar> 大小 </q-item-section>

            <q-item-section>
              {{ $u.humanStorageSize(tmpData.size || 0) }}
            </q-item-section>
          </q-item>

          <!-- 位置 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar> 位置 </q-item-section>

            <q-item-section>
              <span>
                <strong>{{ libraryName }}</strong> >
                {{ pos.length > 0 ? pos.join(" > ") : "/" }}
              </span>
            </q-item-section>
          </q-item>

          <!-- 描述 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar> 描述 </q-item-section>

            <q-item-section>
              <q-input
                dense
                ref="description"
                maxlength="200"
                v-model="tmpData.description"
                :readonly="!canChange"
              />
            </q-item-section>
          </q-item>

          <!-- 更新日期 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar> 更新日期 </q-item-section>

            <q-item-section>
              {{ tmpData.updateTime }}
            </q-item-section>
          </q-item>

          <!-- 创建日期 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar> 创建日期 </q-item-section>

            <q-item-section>
              {{ tmpData.createTime }}
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- 缩略图 -->
          <q-item clickable class="q-py-md">
            <q-item-section avatar> 缩略图 </q-item-section>

            <q-item-section class="dms-clear-flex">
              <dms-image-uploader
                v-if="canChange"
                ref="uploader"
                label="添加缩略图"
                size="150px"
                :url="$s.UPLOAD.UPLOAD_DATA_COVER"
                :form-fields="[
                  { name: 'libraryId', value: libraryId },
                  {
                    name: 'path',
                    value: pos.join(',')
                  }
                ]"
                @rejected="handleUploadRejected"
                @succeed="handleUploadSucceed"
                @failed="handleUploadFailed"
              />
            </q-item-section>

            <q-item-section>
              <dms-gallery
                height="150"
                :pictures="[tmpData.thumbnail]"
                :deletable="canChange"
                @delete="
                  index => {
                    tmpData.thumbnail = '';
                    $pw.toast('删除成功，请点击保存');
                  }
                "
              />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item class="q-my-sm">
            <q-item-section avatar> 当前版本 </q-item-section>

            <q-item-section>
              {{ currentVersion && currentVersion.version }}
            </q-item-section>
            <q-item-section>
              更新者：{{ currentVersion && currentVersion.creator.nickname }}
            </q-item-section>

            <q-space />

            <q-item-section side>
              <q-btn
                color="secondary"
                label="更多历史版本"
                class="q-mr-md"
                @click="handleShowVersions"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </dms-common-panel>

      <q-separator />

      <!-- 按钮 -->
      <q-card-actions>
        <q-btn outline color="cancel" label="关闭" @click="handleCancel" />
        <q-btn
          v-if="canChange"
          color="primary"
          label="保存"
          @click="handleOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {
  DmsCommonPanel,
  DmsItemHeader,
  DmsImageUploader,
  DmsGallery
} from "@/components";
import { DataItem } from "@/models/data";
import { CustomVueComponent } from "@/models/common";
import { VersionItem } from "@/models/version";
import DmsVersionInfo from "./VersionInfo.vue";

export default Vue.extend({
  name: "DmsFileInfo",

  props: {
    dataId: {
      type: Number,
      required: true
    },

    pos: {
      type: Array as PropType<Array<string>>
    },

    libraryId: {
      type: Number,
      required: true
    },

    libraryName: {
      type: String,
      default: ""
    },

    updateDataItem: {
      type: Function as PropType<() => void>,
      default: () => {
        return;
      }
    },

    canChange: {
      type: Boolean,
      default: false
    }
  },

  async created() {
    this.$q.loading.show();

    // 获取资料文件
    const [[, data], [, version]] = await Promise.all([
      this.$s.GetDatum(this.dataId),
      this.$s.GetVersions(this.dataId)
    ]);

    data && (this.tmpData = data?.data);
    version && (this.versionList = version?.data);

    this.$q.loading.hide();
  },

  beforeDestroy() {
    this.tmpData = new Object() as DataItem;
  },

  data() {
    return {
      tmpData: new Object() as DataItem,
      versionList: [] as VersionItem[]
    };
  },

  computed: {
    currentVersion(): VersionItem | undefined {
      if (this.versionList.length > 0)
        return this.versionList[this.versionList.length - 1];
      return undefined;
    }
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

    handleBlurFilename() {
      this.tmpData.name = this.tmpData.name.replace(/\.*$/g, "");

      if (!this.tmpData.name.endsWith(`.${this.tmpData.type}`)) {
        this.tmpData.name += `.${this.tmpData.type}`;
      }
    },

    handleOK() {
      // 按OK，在隐藏QDialog之前
      if (!this.tmpData.name) {
        (this.$refs.dialog as CustomVueComponent).shake();
        (this.$refs.name as CustomVueComponent).focus();
        return;
      }

      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok", this.tmpData);

      // 然后隐藏对话框
      this.hide();
    },

    handleCancel() {
      // 我们只需要隐藏对话框
      this.hide();
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
      this.tmpData.thumbnail = data;

      this.$pw.toast("上传成功，请点击保存");
      (this.$refs.uploader as CustomVueComponent).hide();
    },

    handleUploadFailed({ files, err }: { files: File[]; err: object }) {
      this.$pw.toast(err.toString(), "error");
    },

    handleShowVersions() {
      this.$q.dialog({
        component: DmsVersionInfo,
        parent: this,
        versions: this.versionList
      });
    }
  },

  components: {
    DmsCommonPanel,
    DmsItemHeader,
    DmsGallery,
    DmsImageUploader
  }
});
</script>

<style lang="stylus" scoped></style>
