<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator="/" style="margin:20px 0">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加分类按钮 -->
      <el-row style="margin: 20px 0">
        <el-col :span="24">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->

      <tree-table
        :data="cateList"
        :columns="columns"
        border
        :selection-type="false"
        :expand-type="false"
        :show-row-hover="false"
        :show-index="true"
        index-text="#"
      >
        <template slot="usefull" scope="scope">
          <i v-if="scope.row.cat_deleted===false" class="el-icon-success" style="color:lightgreen"></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>
        <template slot="sort" scope="scope">
          <el-tag v-if="scope.row.cat_level==0" type="primary">一级</el-tag>
          <el-tag v-if="scope.row.cat_level==1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level==2" type="warning">三级</el-tag>
        </template>
        <template slot="edit" scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="iconfont icon-xiugai"
            @click="showChangeCateDialog(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="iconfont icon-iconzhuanqu_shanchu"
            @click="deleteCate(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2,3,5,10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin:20px 0"
        ></el-pagination>
      </div>

      <!-- 添加分类对话框 -->

      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        @close="closeAddCateDialog"
        width="50%"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFromRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" props="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              expand-trigger="hover"
              :options="parentCatList"
              @change="parentCateChange"
              v-model="selectedId"
              :props="myprops"
              clearable
              change-on-select
              style="width:100%"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改分类对话框 -->
      <el-dialog title="修改分类名称" :visible.sync="ChangeCateDialogVisible" width="50%">
        <el-form
          :model="editForm"
          :rules="editRules"
          ref="editForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="editName">
            <el-input v-model="editForm.editName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ChangeCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ChangeCateName">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          lable: "分类名称",
          prop: "cat_name",
          minWidth: "300",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "usefull",
        },
        {
          label: "排序",
          prop: "cat_deleted",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          prop: "row",
          type: "template",
          minWidth: "200",
          template: "edit",
        },
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCatList: [],
      //   指定配置对象
      myprops: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedId: [],
      ChangeCateDialogVisible: false,
      editForm: {
        editName: "",
      },
      editId: "",
      editRules: {
        editName: {
          required: true,
          message: "内容不能为空",
          trigger: "blur",
        },
      },
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.axios.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      console.log(res.data);
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getCateList();
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
    async showAddCateDialog() {
      const { data: res } = await this.axios.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.parentCatList = res.data;
      //   console.log(res.data);
      this.addCateDialogVisible = true;
    },
    parentCateChange() {
      console.log(this.selectedId);
      if (this.selectedId.length > 0) {
        this.addCateForm.cat_level = this.selectedId.length;
        this.addCateForm.cat_pid = this.selectedId[this.selectedId.length - 1];
      } else {
        this.addCateForm.cat_level = 0;
        this.addCateForm.cat_pid = 0;
      }
    },
    addCate() {
      //   console.log(this.addCateForm);
      this.$refs.addCateFromRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.axios.post(
            "categories",
            this.addCateForm
          );
          if (res.meta.status !== 201) {
            return this.$message.error("请求失败");
          }
          this.$message.success("添加成功");
          this.getCateList();
          this.addCateDialogVisible = false;
        } else {
          return this.$message.error("内容不能为空");
        }
      });
    },
    closeAddCateDialog() {
      //   this.$refs.addCateFromRef.resetFields();
      this.addCateForm = {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      };
      this.selectedId = [];
      this.addCateDialogVisible = false;
    },
    showChangeCateDialog(row) {
      this.editForm.editName = row.cat_name;
      this.editId = row.cat_id;
      this.ChangeCateDialogVisible = true;
    },
    ChangeCateName() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.axios.put(
          `categories/${this.editId}`,
          {
            cat_name: this.editForm.editName,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("请求失败");
        }
        this.$message.success("修改成功");
        this.getCateList();
        this.ChangeCateDialogVisible = false;
      });
      console.log(this.editForm.editName);
    },
    async deleteCate(row) {
      const response = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      if (response == "cancel") return;
      const { data: res } = await this.axios.delete(`categories/${row.cat_id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.$message.success("删除成功");
      this.getCateList();
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style>
</style>