<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 权限表格     -->
      <el-table :data="listData" style="width: 100%" border>
        <el-table-column type="index" label="#" align="center" width="70"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level == 2">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: [],
    };
  },
  methods: {
    async getprivate() {
      const { data: res } = await this.axios.get("rights/list");
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.listData = res.data;
    },
  },
  created() {
    this.getprivate();
  },
};
</script>

<style scoped>
.el-breadcrumb {
  margin: 20px 0;
}
</style>