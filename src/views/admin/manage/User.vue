<template>
  <q-table
    class="dms-sticky-header-table dms-body-height-none"
    row-key="id"
    selection="multiple"
    square
    color="secondary"
    binary-state-sort
    :loading="loading"
    :data="users"
    :filter="filter"
    :columns="columns"
    :selected.sync="selected"
    :pagination.sync="pagination"
  >
    <template v-slot:top>
      <div class="q-gutter-x-md">
        <q-btn dense label="刷新" :disable="loading" @click="loadData" />

        <q-btn
          dense
          label="新建成员"
          :disable="loading"
          @click="handleCreateUser"
        />

        <q-btn
          v-show="selected.length > 0"
          dense
          label="删除已选"
          :disable="loading"
          @click="() => handleDeleteUsers()"
        />
      </div>

      <q-space />

      <q-input borderless dense debounce="300" color="primary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <!-- 巧妙地使用 username 列来处理删除按钮列，这样搜索的时候也可以使用 username 进行搜索 -->
    <template v-slot:body-cell-username="props">
      <q-td :props="props">
        <q-btn
          dense
          round
          flat
          icon="delete"
          color="negative"
          @click="() => handleDeleteUsers(props.row)"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :delay="200">
            删除
          </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import Vue from "vue";
import { UserAddItem, UserItem } from "@/models/user";
import { RoleItem } from "@/models/role";
import { TableColumn } from "@/models/common";
import DmsCreateUser from "./CreateUser.vue";

export default Vue.extend({
  name: "DmsAdminManageUser",

  async created() {
    this.$q.loading.show();
    await this.loadData();
    this.$q.loading.hide();
  },

  data() {
    return {
      loading: false,
      filter: "",
      users: [] as UserItem[],
      roles: [] as RoleItem[],
      selected: [] as UserItem[],
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 15
        // rowsNumber: xx if getting data from a server
      }
    };
  },

  computed: {
    columns(): TableColumn[] {
      return [
        {
          name: "nickname",
          required: true,
          label: "姓名",
          align: "left",
          field: "nickname",
          sortable: true
        },
        {
          name: "role",
          label: "权限",
          align: "left",
          field: (row: UserItem) => row.role.name,
          sortable: true
        },
        {
          name: "username",
          label: "",
          align: "left",
          field: "username"
        }
      ];
    }
  },

  watch: {},

  methods: {
    async loadData() {
      this.loading = true;

      this.filter = "";
      this.selected = [];

      const [[, resUsers], [, resRoles]] = await Promise.all([
        this.$s.GetUsers(),
        this.$s.GetRoles()
      ]);
      this.users = resUsers?.data ?? [];
      this.roles = resRoles?.data ?? [];

      this.loading = false;
    },

    handleCreateUser() {
      this.$q
        .dialog({
          component: DmsCreateUser,
          roles: this.roles,
          parent: this
        })
        .onOk(async (user: UserAddItem) => {
          const [, res] = await this.$s.CreateUser(user);
          if (res) {
            this.$pw.toast("创建成功");
            await this.loadData();
          }
        });
    },

    handleDeleteUsers(item?: UserItem) {
      let ids = [] as number[];
      let name = "";

      if (item) {
        ids = [item.id];
        name = item.nickname;
      } else {
        ids = this.selected.map(u => u.id);
        name =
          this.selected.map(u => u.nickname).join(",") +
          " 等 共计 " +
          this.selected.length +
          " 人";
      }

      this.$q
        .dialog({
          title: "确认删除",
          message: "确认删除 " + name + " 吗？",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          const [, res] = await this.$s.DeleteUser(ids);
          if (res) {
            this.$pw.toast("已删除");
            await this.loadData();
          }
        });
    }
  },

  components: {}
});
</script>

<style lang="stylus">
.dms-sticky-header-table
  .q-table__top,
  // .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: var(--q-color-primary)

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
