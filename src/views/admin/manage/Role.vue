<template>
  <q-list class="q-ma-sm">
    <q-expansion-item
      default-opened
      class="dms-hover-rising dms-transition-fast q-mb-sm"
      :class="`bg-grey-${$q.dark.isActive ? 10 : 1}`"
      header-class="bg-primary text-white"
      v-for="role in roles"
      :key="role.id"
    >
      <template v-slot:header>
        <q-item-section>
          {{ role.description }} / {{ role.name }}
        </q-item-section>

        <q-item-section side class="text-white">
          <q-btn
            flat
            dense
            label="更多"
            icon-right="arrow_drop_down"
            @click.stop
          >
            <dms-menu
              :anchor="{ vertical: 'bottom', horizontal: 'left' }"
              :self="{ vertical: 'top', horizontal: 'left' }"
              :menu="[
                {
                  name: '管理',
                  action: () => handleManageRole(role)
                },
                { separator: true },
                {
                  name: '删除',
                  action: () => handleRemove(role.id)
                }
              ]"
            />
          </q-btn>
        </q-item-section>
      </template>

      <dms-permission-item :permissions="permissions" :role="role" />
    </q-expansion-item>
  </q-list>
</template>

<script lang="ts">
import Vue from "vue";
import { DmsMenu } from "@/components";
import { PermissionItem, RoleItem } from "@/models/role";
import { Status } from "@/models/common";
import DmsPermissionItem from "./PermissionItem.vue";

export default Vue.extend({
  name: "DmsAdminManageRole",

  props: {},

  async created() {
    await this.loadData();
  },

  beforeDestroy() {
    this.roles = [];
  },

  data() {
    return {
      roles: [] as RoleItem[],
      permissions: [] as PermissionItem[],
      selectedRole: {} as RoleItem
    };
  },

  computed: {},

  watch: {},

  methods: {
    async loadData() {
      this.$q.loading.show();

      const [[, resRoles], [, resPerms]] = await Promise.all([
        this.$s.GetRoles(),
        this.$s.GetPermissions()
      ]);
      this.roles = resRoles?.data ?? [];
      this.permissions = resPerms?.data ?? [];

      this.$q.loading.hide();
    },

    handleManageRole(role: RoleItem) {
      this.selectedRole = role;
      console.log(this.selectedRole);
      // this.$q
      //   .dialog({
      //     permissions: this.permissions,
      //     groupPerms: this.permGroups,
      //     rolePerms: this.permRoles,
      //     roles: this.roles,
      //     role: this.selectedRole,
      //     component: PwPermManageRoleDialog,
      //     parent: this
      //   })
      //   .onOk((v: boolean) => {
      //     v && this.loadData();
      //   });
    },

    handleRemove(id: number) {
      console.log("remove", id);
      // this.$q
      //   .dialog({
      //     title: "警告",
      //     message: `是否确定删除 - ${
      //       this.roles.find(x => x.id === id)?.name
      //     } ?`,
      //     cancel: true,
      //     persistent: true
      //   })
      //   .onOk(() => {
      //     this.$s.DeleteRole(id).then(([, res]) => {
      //       if (res && res.status === Status.OK) {
      //         const index = this.roles.findIndex(x => x.id === id);
      //         this.roles.splice(index, 1);
      //         this.$pw.toast("删除成功");
      //       }
      //     });
      //   });
    }
  },

  components: {
    DmsMenu,
    DmsPermissionItem
  }
});
</script>

<style lang="stylus" scoped></style>
