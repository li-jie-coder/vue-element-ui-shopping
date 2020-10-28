<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator="/" style="margin: 20px 0">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 提示消息 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        class="el-icon-warning"
        style="margin: 20px 0"
      ></el-alert>

      <!-- 选择商品 -->
      <el-cascader
        expand-trigger="hover"
        :options="goodsList"
        v-model="selectedKeys"
        :props="goodsprops"
        @change="handleChange"
      ></el-cascader>

      <!-- 设置参数 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        style="margin: 20px 0"
      >
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" :disabled="status" @click="showAddDialog"
            >添加参数</el-button
          >
          <el-table
            :data="onlyTableList"
            border
            style="width: 100%; margin: 20px 0"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row)"
                  >{{ tag }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ 新参数</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              width="70"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              minWidth="180"
            ></el-table-column>
            <el-table-column label="操作" minWidth="180">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  class="iconfont icon-xiugai"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  @click="deleteDetail(scope.row)"
                  size="mini"
                  class="iconfont icon-iconzhuanqu_shanchu"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="status" @click="showAddDialog"
            >添加参数</el-button
          >
          <el-table
            :data="manyTableList"
            border
            style="width: 100%; margin: 20px 0"
          >
            <!-- 参数列表 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row)"
                  >{{ tag }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ 新参数</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              width="70"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              minWidth="180"
            ></el-table-column>
            <el-table-column label="操作" minWidth="180">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  class="iconfont icon-xiugai"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  @click="deleteDetail(scope.row)"
                  size="mini"
                  class="iconfont icon-iconzhuanqu_shanchu"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数弹出框 -->

      <el-dialog
        :title="whichtitle"
        :visible.sync="addDialogVisible"
        width="50%"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRules"
          label-width="100px"
        >
          <el-form-item prop="attr_name" label="添加参数">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDetail">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 参数编辑弹出框 -->
      <el-dialog title="编辑参数" :visible.sync="editDialogVisible" width="50%">
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRules"
          label-width="100px"
        >
          <el-form-item prop="attr_name" label="参数名称">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEdit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      goodsprops: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [],
      selectedKey: "",
      activeName: "only",
      onlyTableList: [],
      manyTableList: [],
      addDialogVisible: false,
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false,
      editId: "",
      editForm: {
        attr_name: "",
      },
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 获取分类列表
    async getGoodsList() {
      const { data: res } = await this.axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.goodsList = res.data;
      //   console.log(this.goodsList);
    },
    handleChange() {
      console.log(this.selectedKeys);
      this.selectedKey = this.selectedKeys[this.selectedKeys.length - 1];
      this.handleClick();
    },

    // 改变 静/动态参数 tab 获取数据
    async handleClick() {
      console.log(this.activeName);
      if (this.selectedKeys.length !== 3) {
        this.onlyTableList = [];
        this.manyTableList = [];
        return;
      }
      const { data: res } = await this.axios.get(
        `categories/${this.selectedKey}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      res.data.forEach((e, i) => {
        if (e.attr_vals.length == 0) {
          e.attr_vals = [];
        } else {
          e.attr_vals = e.attr_vals.split(" ");
        }
        e.inputVisible = false;
        e.inputValue = "";
      });
      console.log(res.data);

      if (this.activeName == "only") {
        this.onlyTableList = res.data;
      } else {
        this.manyTableList = res.data;
      }
    },

    // 编辑参数
    async showEditDialog(row) {
      this.editId = row.attr_id;
      const { data: res } = await this.axios.get(
        `categories/${this.selectedKey}/attributes/${row.attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      // console.log(res.data);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    handleEdit() {
      this.$refs.editFormRules.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.axios.put(
          `categories/${this.selectedKey}/attributes/${this.editId}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("请求失败");
        }
        // console.log(res.data);
        this.$message.success("修改成功");
        this.editForm.attr_name = "";
        this.handleClick();
        this.editDialogVisible = false;
      });
    },

    //  添加参数
    showAddDialog() {
      this.addDialogVisible = true;
    },
    async addDetail() {
      this.$refs.addFormRules.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.axios.post(
          `categories/${this.selectedKey}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("请求失败");
        }
        console.log(res.data);
        this.$message.success("添加成功");
        this.addForm.attr_name = "";
        this.handleClick();
        this.addDialogVisible = false;
      });
    },

    //  删除参数
    async deleteDetail(row) {
      try {
        const response = await this.$confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (response == "confirm") {
          const { data: res } = await this.axios.delete(
            `categories/${
              this.selectedKeys[this.selectedKeys.length - 1]
            }/attributes/${row.attr_id}`
          );
          if (res.meta.status !== 200) return this.$message.error("请求失败");
          this.$message.success("删除成功");
          this.handleClick();
        }
      } catch {
        return this.$message.success("已取消删除");
      }
    },

    // 添加参数新标签
    async handleClose(row, index) {
      console.log(row);
      row.attr_vals.splice(row.attr_vals.indexOf(index), 1);
      row.inputVisible = false;
      row.inputValue = "";
      const { data: res } = await this.axios.put(
        `categories/${this.selectedKey}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      console.log(res.data);
      this.$message.success("修改成功");
    },

    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(row) {
      if (row.inputValue) {
        row.attr_vals.push(row.inputValue.trim());
        row.inputVisible = false;
        row.inputValue = "";
        const { data: res } = await this.axios.put(
          `categories/${this.selectedKey}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: this.activeName,
            attr_vals: row.attr_vals.join(" "),
          }
        );
        if (res.meta.status !== 200) return this.$message.error("请求失败");
        console.log(res.data);
        row = res.data;
        this.$message.success("添加成功");
      }
    },
  },
  created() {
    this.getGoodsList();
  },
  computed: {
    status() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    whichtitle() {
      if (this.activeName == "only") {
        return "添加静态参数";
      }
      return "添加动态参数";
    },
  },
};
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>