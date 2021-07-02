<template>
  <q-item>
    <q-item-section>
      <q-card-section class="text-center text-h3">
        共 {{ libraries.length }} 个资料库
      </q-card-section>
      <q-card-section>
        <q-item class="text-h6">
          <q-item-section avatar class="text-bold">最近更新</q-item-section>
          <q-item-section> {{ lastUpdateLib.name }} 库 </q-item-section>
        </q-item>

        <q-item class="text-h6">
          <q-item-section avatar class="text-bold">更新时间</q-item-section>
          <q-item-section> {{ lastUpdateLib.time }} </q-item-section>
        </q-item>
      </q-card-section>
    </q-item-section>

    <q-item-section>
      <ve-pie
        :title="{
          show: true,
          text: '资料库文件数量统计',
          textStyle: textStyle,
          x: 'center',
          subtext: `当前资料库共有 ${PieFileCount.rows.reduce(
            (p, c) => p + c['文件数量'],
            0
          )} 个文件`
        }"
        :legend-visible="false"
        :data="PieFileCount"
        :tooltip="{
          formatter: n => `${n.value} 个文件，占比 ${n.percent}%`
        }"
      />
    </q-item-section>

    <q-item-section>
      <ve-pie
        :title="{
          show: true,
          text: '资料库文件大小统计',
          textStyle: textStyle,
          x: 'center',
          subtext: `当前资料库共 ${$u.humanStorageSize(
            PieSizeCount.rows.reduce((p, c) => p + c['大小'], 0)
          )} `
        }"
        :legend-visible="false"
        :data="PieSizeCount"
        :tooltip="{
          formatter: n =>
            `共 ${$u.humanStorageSize(n.value)}，占比 ${n.percent}%`
        }"
      />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { DataItem } from "@/models/data";
import { LibraryItem } from "@/models/library";
import { Chart } from "@/mixins";

export default Vue.extend({
  name: "DmsDataChart",

  props: {
    data: {
      type: Object as PropType<{ [key: number]: DataItem[] }>
    },

    libraries: {
      type: Array as PropType<LibraryItem[]>
    }
  },

  created() {
    this.init();
  },

  mixins: [Chart],

  data() {
    return {
      lastUpdateLib: { name: "暂无", time: "" },
      PieFileCount: {
        columns: ["名称", "文件数量"],
        rows: [] as { 名称: string; 文件数量: number }[]
      },

      PieSizeCount: {
        columns: ["名称", "大小"],
        rows: [] as { 名称: string; 大小: number }[]
      }
    };
  },

  watch: {
    data() {
      this.init();
    }
  },

  methods: {
    init() {
      let lastUpdateData: DataItem | undefined = undefined;
      for (const key in this.data) {
        if (Object.prototype.hasOwnProperty.call(this.data, key)) {
          const data = this.data[key];
          const name =
            this.libraries.find(x => x.id === data[0].libraryId)?.name ??
            "unknown";

          // 在所有资料中查找最近更新的那个
          const _updateData =
            data.sort((a, b) => {
              const updateA = new Date(a.updateTime);
              const updateB = new Date(b.updateTime);
              return updateB.getTime() - updateA.getTime();
            })?.[0] ?? undefined;

          if (_updateData) {
            if (!lastUpdateData) {
              lastUpdateData = _updateData;
            } else {
              const t1 = new Date(lastUpdateData.updateTime).getTime();
              const t2 = new Date(_updateData.updateTime).getTime();
              if (t2 > t1) lastUpdateData = _updateData;
            }
          }

          this.PieFileCount.rows.push({
            名称: name,
            文件数量: data.length
          });

          this.PieSizeCount.rows.push({
            名称: name,
            大小: data.reduce((pre, cur) => pre + cur.size, 0)
          });
        }
      }

      // 添加最近更新的信息
      if (lastUpdateData) {
        const lib = this.libraries.find(
          x => x.id === (lastUpdateData?.libraryId ?? -1)
        );

        if (lib) {
          this.lastUpdateLib.name = lib.name;
          this.lastUpdateLib.time = lastUpdateData.updateTime;
        }
      }
    }
  },

  components: {}
});
</script>

<style lang="stylus" scoped></style>
