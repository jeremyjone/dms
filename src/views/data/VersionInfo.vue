<template>
  <q-dialog full-height ref="dialog" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin"
      :style="{ width: '700px', 'max-width': '80vw' }"
    >
      <dms-common-panel>
        <dms-item-header
          bordered
          bold
          sticky
          title="版本信息"
          :right-btn="{
            icon: 'close',
            action: handleOK
          }"
        />

        <q-card-section
          class="scroll"
          :style="{ height: 'calc(100vh - 88px)' }"
        >
          <q-timeline color="primary">
            <q-timeline-entry
              v-for="v in tmpV"
              :key="v.version"
              :title="v.version"
              :subtitle="v.createTime"
            >
              <div class="text-subtitle2">更新者：{{ v.creator.nickname }}</div>
              <div>备注：{{ v.comment }}</div>
            </q-timeline-entry>
          </q-timeline>
        </q-card-section>
      </dms-common-panel>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { DmsCommonPanel, DmsItemHeader } from "@/components";
import { CustomVueComponent } from "@/models/common";
import { VersionItem } from "@/models/version";
import { clone } from "@/tools";

export default Vue.extend({
  name: "DmsVersionInfo",

  props: {
    versions: Array as PropType<Array<VersionItem>>
  },

  created() {
    this.tmpV = clone(this.versions);
    this.tmpV.reverse();
  },

  data() {
    return {
      tmpV: [] as Array<VersionItem>
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
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok");
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
