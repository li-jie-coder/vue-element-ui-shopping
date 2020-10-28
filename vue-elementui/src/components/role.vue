<template>
  <div>
    <!-- 面包屑   -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 角色列表   -->
      <el-table :data="roleList" style="width: 100%" border>
        <el-table-column type="expand" prop="children">
          <template slot-scope="scope">
            <el-row
              :class="['btborder', 'center', index == 0 ? 'tpborder' : '']"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级菜单    -->
              <el-col :span="5" style="width:200px">
                <el-tag closable style="margin: 10px">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right" style="padding-left: 5px"></i>
              </el-col>

              <!-- 二级·三级菜单 -->
              <el-col :span="19">
                <el-row
                  :class="['center', index != 0 ? 'tpborder' : '']"
                  style="padding: 5px 0"
                  v-for="(item2, index) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6" style="width:200px">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRolesRights(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right" style="padding-left: 5px"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      style="margin: 5px"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="deleteRolesRights(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="#" type="index" width="70px" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="iconfont icon-xiugai">编辑</el-button>
            <el-button type="danger" size="mini" icon="iconfont icon-iconzhuanqu_shanchu">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="iconfont icon-shezhi"
              @click="setRole(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title=" 分配权限" :visible.sync="setRoleDialogVisible">
        <el-tree
          :data="rightsList"
          show-checkbox
          default-expand-all
          :default-checked-keys="defaultkeys"
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"
        ></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "role",
  data() {
    return {
      roleList: [],
      setRoleDialogVisible: false,
      rightsList: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      defaultkeys: [],
      roleId: "",
    };
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.roleList = res.data;
    },
    async deleteRolesRights(row, rightsId) {
      console.log(row.id, rightsId);
      const { data: res } = await this.axios.delete(
        `roles/${row.id}/rights/${rightsId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      // console.log(res.data);
      row.children = res.data;
    },
    getKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getKeys(item, arr);
      });
    },
    async setRole(row) {
      // console.log(row);
      this.roleId = row.id;
      this.defaultkeys = [];
      const { data: res } = await this.axios.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.erorr("请求失败");
      }
      this.rightsList = res.data;
      console.log(this.rightsList);
      this.getKeys(row, this.defaultkeys);
      this.setRoleDialogVisible = true;
    },
    async getCheckedKeys() {
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys(),
      ];
      const allkeys = keys.toString();
      // console.log(String(keys));
      console.log(allkeys);
      const { data: res } = await this.axios.post(
        `roles/${this.roleId}/rights`,
        {
          rids: allkeys,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      // console.log(res);
      this.getRoleList();
      this.$message.success("修改成功");
      this.setRoleDialogVisible = false;
    },
  },
  created() {
    this.getRoleList();
  },
};
</script>

<style scoped>

.center {
  display: flex;
  align-items: center;
}

.tobecol {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tpborder {
  border-top: 1px solid #ebeef5;
}
.btborder {
  border-bottom: 1px solid #ebeef5;
}
</style>
