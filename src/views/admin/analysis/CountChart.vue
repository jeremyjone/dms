<template>
  <q-card>
    <q-card-section>
      <ve-line
        :title="{
          show: true,
          text: `${name} 库新增 / 更新统计`,
          textStyle: textStyle,
          x: 'center'
        }"
        :legend="{ top: 40, textStyle: textStyle }"
        :grid="{ top: 90, right: 15, containLabel: true }"
        :data="charts"
        :settings="chartSettings"
        :xAxis="categoryAxis(charts.rows, x => x[charts.columns[0]])"
        :yAxis="valueAxis()"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { DataItem } from "@/models/data";
import { Chart } from "@/mixins";

export default Vue.extend({
  name: "DmsDataCountChart",

  props: {
    data: {
      type: Array as PropType<DataItem[]>
    },

    name: {
      type: String
    }
  },

  created() {
    this.init();
  },

  mixins: [Chart],

  data() {
    return {
      charts: {
        columns: ["日期", "新增数量", "修改数量"],
        rows: [] as { 日期: string; 新增数量: number; 修改数量: number }[]
      }
    };
  },

  computed: {
    chartSettings() {
      return {
        axisSite: { right: ["下单率"] },
        yAxisType: ["KMB", "percent"],
        yAxisName: ["数值", "比率"]
      };
    },

    valueAxis() {
      return () => {
        return {
          type: "value",
          splitNumber: 1,
          minInterval: 1,
          axisLine: {
            symbol: ["none", "arrow"],
            symbolSize: [7, 10],
            symbolOffset: [0, 7],
            lineStyle: this["textStyle"]
          }
        };
      };
    },

    categoryAxis() {
      return (
        value: object[],
        cb: (value: object, index: number, array: object[]) => unknown
      ) => {
        return {
          type: "category",
          data: value.map(cb),
          axisLabel: {
            rotate: value.length > 4 ? 30 : 0,
            color: () => this["textStyle"].color
          },
          axisLine: {
            lineStyle: this["textStyle"]
          }
        };
      };
    }
  },

  watch: {
    assets() {
      this.init();
    }
  },

  methods: {
    init() {
      this.charts.rows = [];

      // 将 assets 数据转化为图表数据
      const count: { [key: string]: { create: number; update: number } } = {};
      this.data.forEach(d => {
        const createDate = d.createTime.split(" ")[0];
        if (Object.prototype.hasOwnProperty.call(count, createDate)) {
          count[createDate].create += 1;
        } else {
          count[createDate] = { create: 1, update: 0 };
        }

        // 时间相同为创建，不算更新
        if (d.updateTime !== d.createTime) {
          const updateDate = d.updateTime.split(" ")[0];
          if (Object.prototype.hasOwnProperty.call(count, updateDate)) {
            count[updateDate].update += 1;
          } else {
            count[updateDate] = { create: 0, update: 1 };
          }
        }
      });

      for (const key in count) {
        if (Object.prototype.hasOwnProperty.call(count, key)) {
          const value = count[key];
          this.charts.rows.push({
            日期: key,
            新增数量: value.create,
            修改数量: value.update
          });
        }
      }

      this.charts.rows.sort((a, b) => {
        return new Date(a["日期"]).getTime() - new Date(b["日期"]).getTime();
      });
    }
  },

  components: {}
});
</script>

<style lang="stylus" scoped></style>
