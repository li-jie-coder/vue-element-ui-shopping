<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator="/" style="margin: 20px 0">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据图</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="main" ref="mymain"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {};
  },
  methods: {
    async getReports() {
      var myChart = echarts.init(this.$refs.mymain);
      const { data: res } = await this.axios.get("reports/type/1");
      console.log(res.data);
      const { legend, series, xAxis, yAxis } = res.data;

      var option = {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend,
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis,
        yAxis,
        series,
      };

      console.log(option);
      myChart.setOption(option);
    },
  },
  mounted() {
    this.getReports();
  },
};
</script>

<style scoped>

.main {
  min-width: 700px;
  min-height: 600px;
}
</style>