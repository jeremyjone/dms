<template>
  <q-dialog persistent ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <dms-common-panel>
        <dms-item-header bordered bold title="创建新成员" />

        <q-list>
          <q-item clickable class="q-py-none">
            <!-- 用户名 -->
            <q-item-section avatar> 用户名 </q-item-section>

            <q-item-section>
              <q-input
                dense
                v-model="user.username"
                maxlength="16"
                ref="username"
                :rules="[
                  val => !!val || '*必填*',
                  val => /^[a-zA-Z]/.test(val) || '起始只能是英文字母',
                  val => val.length > 3 || '长度需要大于3',
                  val => /^\w*$/.test(val) || '用户名只能使用英文、数字和下划线'
                ]"
              />
            </q-item-section>
          </q-item>

          <!-- 昵称 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar> 昵称 </q-item-section>

            <q-item-section>
              <q-input
                dense
                ref="nickname"
                maxlength="20"
                v-model="user.nickname"
                :rules="[val => !!val || '*必填*']"
              />
            </q-item-section>
          </q-item>

          <!-- 密码 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar> 密码 </q-item-section>

            <q-item-section>
              <q-input
                dense
                ref="password"
                maxlength="30"
                v-model="user.password"
                :rules="[
                  val => !!val || '*必填*',
                  val =>
                    /^\w*$/.test(val) || '用户名只能使用英文、数字和下划线',
                  val => val.length > 7 || '长度不能小于8'
                ]"
              />
            </q-item-section>
          </q-item>

          <!-- 权限 -->
          <q-item clickable class="q-py-none">
            <q-item-section avatar> 用户角色 </q-item-section>

            <q-item-section>
              <q-select
                dense
                emit-value
                map-options
                ref="role"
                v-model="roleId"
                option-value="id"
                option-label="name"
                :options="roles"
                :rules="[val => !!val || '*必填*']"
              >
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                    dense
                  >
                    <q-item-section>
                      <q-item-label v-html="scope.opt.name" />
                      <q-item-label caption>
                        {{ scope.opt.description }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item-section>
          </q-item>
        </q-list>
      </dms-common-panel>

      <!-- 按钮 -->
      <q-card-actions align="right">
        <q-btn outline color="cancel" label="取消" @click="handleCancel" />
        <q-btn color="primary" label="确定" @click="handleOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { DmsCommonPanel, DmsItemHeader } from "@/components";
import { UserAddItem } from "@/models/user";
import { RoleItem } from "@/models/role";
import { Status, CustomVueComponent } from "@/models/common";

export default Vue.extend({
  name: "DmsCreateUser",

  props: {
    // ...你自定义的属性
    roles: {
      type: Array as PropType<Array<RoleItem>>,
      required: true
    }
  },

  data() {
    return {
      user: new Object() as UserAddItem,
      roleId: ""
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

    handleOk() {
      // 按OK，在隐藏QDialog之前
      if (
        !this.user.username ||
        !(this.user.username.length > 3) ||
        !/^[a-zA-Z]\w*$/.test(this.user.username)
      ) {
        (this.$refs.dialog as CustomVueComponent).shake();
        (this.$refs.username as CustomVueComponent).focus();
        return;
      }

      if (!this.user.nickname) {
        (this.$refs.dialog as CustomVueComponent).shake();
        (this.$refs.nickname as CustomVueComponent).focus();
        return;
      }

      if (
        !this.user.password ||
        !(this.user.password.length > 7) ||
        !/\w*$/.test(this.user.password)
      ) {
        (this.$refs.dialog as CustomVueComponent).shake();
        (this.$refs.password as CustomVueComponent).focus();
        return;
      }

      if (!this.roleId) {
        (this.$refs.dialog as CustomVueComponent).shake();
        (this.$refs.role as CustomVueComponent).focus();
        return;
      }

      this.user.roleId = parseInt(this.roleId);
      this.user.password = this.$u.encrypt(this.user.password);
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok", this.user);
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
