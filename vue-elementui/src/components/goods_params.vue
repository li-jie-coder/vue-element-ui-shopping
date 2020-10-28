<template>
  <div>
    <!-- 面包屑   -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="search_box">
        <el-input
          placeholder="请输入内容"
          v-model="input"
          clearable
          @input="search"
        ></el-input>
        <el-button type="primary" @click="addGoods"
          >添加用户</el-button
        >
      </div>
      <!-- 商品列表-->
      <el-table :data="goods" border style="width: 180">
        <el-table-column
          type="index"
          label="#"
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          minWidth="500"
          label="商品名称"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          minWidth="120"
        ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column label="创建时间" minWidth="100">
          <template slot-scope="scope">
            <p>{{ scope.row.upd_time | dateFormate }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" minWidth="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="iconfont icon-xiugai"
              circle
              @click="getgoodsdetail(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="iconfont icon-iconzhuanqu_shanchu"
              circle
              @click="deletegoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑弹出框-->
      <el-dialog title="收货地址" :visible.sync="editDialogVisible">
        <el-form ref="editForm" :model="editform" :rules="rules">
          <el-form-item label="商品名称" prop="goods_name" label-width="100px">
            <el-input v-model="editform.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price" label-width="100px">
            <el-input v-model="editform.goods_price"></el-input>
          </el-form-item>
          <el-form-item
            label="商品数量"
            prop="goods_number"
            label-width="100px"
          >
            <el-input v-model="editform.goods_number"></el-input>
          </el-form-item>
          <el-form-item
            label="商品重量"
            prop="goods_weight"
            label-width="100px"
          >
            <el-input v-model="editform.goods_weight"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changegoods">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页-->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5, 10, 15]"
          :page-size="goodsQuery.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsQuery: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goods: [],
      input: "",
      total: 0,
      currentPage: 1,
      ruleForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        goods_price: [
          { required: true, message: "请输商品价格", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        goods_number: [
          { required: true, message: "请输商品数量", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        goods_weight: [
          { required: true, message: "请输商品重量", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      editform: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
      },
      editDialogVisible: false,
      selectedId: "",
    };
  },

  methods: {
    handleSizeChange(val) {
      this.goodsQuery.pagesize = val;
      this.getgoods();
    },
    handleCurrentChange(val) {
      this.goodsQuery.pagenum = val;
      this.getgoods();
    },
    search() {
      this.goodsQuery.query = this.input;
      this.getgoods();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    //获取商品
    getgoods() {
      this.axios
        .get("/goods", { params: this.goodsQuery })
        .then((res) => {
          console.log(res.data.data.goods);
          this.total = res.data.data.total;
          this.goods = res.data.data.goods;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    //添加商品
    async addGoods() {
        this.$router.push('/goods/add')
    },

    //编辑商品框
    async getgoodsdetail(id) {
      this.editDialogVisible = true;
      this.selectedId = id;
      const { data: res } = await this.axios.get(`goods/${id}`);
      const { goods_name, goods_price, goods_number, goods_weight } = res.data;
      this.editform = {
        goods_name: goods_name.toString(),
        goods_price: goods_price.toString(),
        goods_number: goods_number.toString(),
        goods_weight: goods_weight.toString(),
      };
      console.log(this.editform);
    },
    changegoods() {
      console.log(this.editform);
      this.$refs.editForm.validate(async (valid) => {
        console.log(valid);
        if (valid) {
          const { data: res } = await this.axios.put(
            `goods/${this.selectedId}`,
            {
              goods_name: this.editform.goods_name,
              goods_price: this.editform.goods_price,
              goods_number: this.editform.goods_number,
              goods_weight: this.editform.goods_weight,
            }
          );
          console.log(res);
          if (res.meta.status != 201) {
            return this.$message.error("请求失败");
          }
          this.editform = {};
          this.getgoods();
          this.editDialogVisible = false;
          this.$message.success("修改成功");
        } else {
          return this.$message.error("请按要求输入");
          return false;
        }
      });
    },
    deletegoods(id) {
      this.$confirm("此操作将永久删除该选项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.axios.delete(`goods/${id}`);
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.getgoods();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.getgoods();
  },
  filters: {
    dateFormate(times) {
      const date = new Date(times);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();
      return `${y}/${m}/${d}`;
    },
  },
};
</script>

<style scoped>
.block {
  margin: 20px 0;
}
.el-table {
  line-height: 40px;
}
.box-card {
  width: 95%;
}

.search_box {
  float: left;
  display: flex;
  justify-content: space-between;
  width: 420px;
  margin: 20px 0;
}
.search_box .el-input {
  width: 300px;
}
.el-form .el-input {
  width: 80%;
  text-align: center;
}
</style>