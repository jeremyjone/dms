<template>
  <q-card flat>
    <q-card-section>
      <dms-data-chart :data="allData" :libraries="libraries" />
    </q-card-section>

    <q-card-section>
      <q-tabs
        v-model="tab"
        dense
        no-caps
        inline-label
        class="bg-secondary text-white shadow-2"
      >
        <q-tab
          v-for="lib in libraries"
          :key="lib.id"
          :name="lib.id"
          :label="lib.name"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel
          class="q-gutter-y-md"
          v-for="lib in libraries"
          :key="lib.id"
          :name="lib.id"
        >
          <q-table
            row-key="id"
            square
            color="secondary"
            binary-state-sort
            :loading="loading"
            :data="data"
            :columns="columns"
            :pagination.sync="pagination"
          >
            <template v-slot:top>
              <div class="full-width row">
                <span class="col-4">
                  文件夹 {{ data.filter(x => filteFolder(x)).length }} 个
                </span>
                <span class="col-4">
                  文件 {{ data.filter(x => !filteFolder(x)).length }} 个
                </span>
                <span class="col-4">
                  共
                  {{
                    $u.humanStorageSize(
                      data.reduce((pre, cur) => pre + cur.size, 0)
                    )
                  }}
                </span>
              </div>
            </template>

            <template v-slot:body-cell-size="props">
              <q-td :props="props">
                {{
                  !filteFolder(props.row)
                    ? $u.humanStorageSize(props.value)
                    : ""
                }}
              </q-td>
            </template>
          </q-table>

          <!-- 图表 -->
          <dms-data-count-chart :data="data" :name="lib.name" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>

    <q-inner-loading :showing="loading">
      <q-spinner-dots color="primary" size="50px" />
    </q-inner-loading>
  </q-card>
</template>

<script lang="ts">
import Vue from "vue";
import { DataItem } from "@/models/data";
import { LibraryItem } from "@/models/library";
import { TableColumn } from "@/models/common";
import DmsDataCountChart from "./CountChart.vue";
import DmsDataChart from "./DataChart.vue";

export default Vue.extend({
  name: "DmsAdminAnalysis",

  props: {},

  async created() {
    await this.loadData();
  },

  data() {
    return {
      loading: false,
      tab: -1,
      libraries: [] as LibraryItem[],
      allData: {} as { [key: number]: DataItem[] },
      data: [] as DataItem[],
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: 10,
        sortBy: "updateTime"
      }
    };
  },

  computed: {
    columns(): TableColumn[] {
      return [
        {
          name: "name",
          required: true,
          label: "名称",
          align: "left",
          field: "name",
          sortable: true
        },
        {
          name: "description",
          label: "描述",
          align: "left",
          field: "description",
          sortable: true
        },
        {
          name: "type",
          label: "类型",
          align: "left",
          field: "type",
          sortable: true
        },
        {
          name: "size",
          label: "大小",
          align: "left",
          field: "size",
          sortable: true
        },
        {
          name: "creatorId",
          label: "创建者",
          align: "left",
          field: (row: DataItem) => row.creator.nickname,
          sortable: true
        },
        {
          name: "artistId",
          label: "更新者",
          align: "left",
          field: (row: DataItem) => row.creator.nickname,
          sortable: true
        },
        {
          name: "updateTime",
          label: "更新日期",
          align: "left",
          field: "updateTime",
          sortable: true
        },
        {
          name: "createTime",
          label: "创建日期",
          align: "left",
          field: "createTime",
          sortable: true
        }
      ];
    }
  },

  watch: {
    tab(nv) {
      if (nv > -1) {
        this.onClickLib(nv);
      }
    }
  },

  methods: {
    filteFolder(data: DataItem): boolean {
      return ["folder"].includes(data.type);
    },

    async loadData() {
      this.loading = true;

      const [, resLibrary] = await this.$s.GetLibraries();
      this.libraries = resLibrary?.data ?? [];

      // 然后获取所有资料内容数据
      const allData = await Promise.all(
        this.libraries.map(x => this.$s.GetData(x.id, -1))
      );

      allData.forEach(x => {
        if (x[1] && x[1].data.length > 0) {
          const arr = x[1].data;
          const id = arr[0].libraryId;

          this.$set(this.allData, id, arr);
        }
      });

      this.tab = this.libraries?.[0]?.id ?? -1;

      this.loading = false;
    },

    onClickLib(libraryId: number) {
      this.loading = true;
      this.data = this.allData[libraryId] ?? [];
      this.loading = false;
    }
  },

  components: {
    DmsDataCountChart,
    DmsDataChart
  }
});
</script>

<style lang="stylus" scoped></style>
