<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <dms-common-panel>
        <dms-item-header bordered bold title="添加更新备注" />

        <q-list>
          <q-item clickable class="q-py-none">
            <q-item-section>
              <q-input dense maxlength="200" v-model="comment" />
            </q-item-section>
          </q-item>
        </q-list>
      </dms-common-panel>

      <!-- 按钮示例 -->
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { DmsCommonPanel, DmsItemHeader } from "@/components";

export default {
  props: {
    // ...你自定义的属性
  },

  data() {
    return {
      comment: ""
    };
  },

  methods: {
    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit("hide");
    },

    onOKClick() {
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok", this.comment);
      // 或带有有效负载：this.$emit('ok', { ... })

      // 然后隐藏对话框
      this.hide();
    },

    onCancelClick() {
      // 我们只需要隐藏对话框
      this.hide();
    }
  },

  components: {
    DmsCommonPanel,
    DmsItemHeader
  }
};
</script>
