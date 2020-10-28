<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator="/" style="margin: 20px 0">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>

      <!--  进度条  -->
      <el-steps
        :active="stepActive - 0"
        finish-status="success"
        simple
        align-center
        style="margin: 20px 0"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--  侧边栏  -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsRules"
        ref="addGoodsForm"
        label-position="top"
        label-width="100px"
      >
        <!-- <el-tabs v-model="stepActive" tab-position="left" @tab-click="getIndex"> -->
        <el-tabs
          v-model="stepActive"
          tab-position="left"
          :before-leave="changeTabs"
          @tab-click="TabsChange"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                :autofocus="addGoodsForm.goods_name ? false : true"
                v-model="addGoodsForm.goods_name"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="addGoodsForm.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="addGoodsForm.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="addGoodsForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <div class="block">
                <el-cascader
                  v-model="selectedKeys"
                  :options="catList"
                  :props="catProps"
                  @change="handleChange"
                ></el-cascader>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-checkbox-group
              v-model="item.attr_vals"
              v-for="(item, index) in manyTabsList"
              :key="index"
            >
              <h5 style="font-size: 10px">{{ item.attr_name }}</h5>
              <el-checkbox
                v-for="(item2, index2) in AllAttr_vals[index]"
                :key="index2"
                :label="item2"
                @change="getAllchecked(index)"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyTabsList"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="headerToken"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="getPicsList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览弹出框 -->
    <el-dialog :visible.sync="picDialogVisible" width="50%" align="center">
      <el-image :src="picUrl"></el-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stepActive: 0,
      addGoodsForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: "",
        pics: [],
      },
      addGoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      catList: [],
      selectedKeys: [],
      catProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      manyTabsList: [],
      AllAttr_vals: [],
      onlyTabsList: [],
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      headerToken: {
        Authorization: sessionStorage.getItem("token"),
      },
      picUrl: "",
      picDialogVisible: false,
    };
  },
  methods: {
    // getIndex(e) {
    //   this.stepActive = e.index - 0;
    // },

    //Tabs 切换
    TabsChange() {},
    // 获取商品分类列表
    async getCatList() {
      const { data: res } = await this.axios.get("categories");
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.catList = res.data;
      console.log(this.catList);
    },

    //监听商品分类改变
    handleChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
      }
    },

    //未选择分类时禁止切换tabs
    changeTabs(activeName, oldActiveName) {
      console.log(oldActiveName, activeName);
      if (oldActiveName === "0" && this.selectedKeys.length == 0) {
        this.$message.error("请选择商品分类");
        return false;
      }
      if (activeName === "1") {
        this.getManyList();
      } else if (activeName === "2") {
        this.getOnlyList();
      }
    },

    // 获取商品参数
    async getManyList() {
      if (this.manyTabsList.length !== 0) return;
      const { data: res } = await this.axios.get(
        `categories/${this.catId}/attributes`,
        {
          params: {
            sel: "many",
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.manyTabsList = res.data;
      this.manyTabsList.forEach((e, i) => {
        if (e.attr_vals.length == 0) return;
        e.attr_vals = e.attr_vals.split(" ");
      });
      this.AllAttr_vals = this.manyTabsList.map((e, i) => e.attr_vals);

      console.log(this.AllAttr_vals);
      console.log(this.manyTabsList);
    },
    async getOnlyList() {
      // if (this.onlyTabsList.length !== 0) return;
      const { data: res } = await this.axios.get(
        `categories/${this.catId}/attributes`,
        {
          params: {
            sel: "only",
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.onlyTabsList = res.data;
      console.log(res.data);
    },

    getAllchecked(index) {
      console.log(this.manyTabsList[index]);
    },

    // 删除图片
    handleRemove(file) {
      console.log(file);
      const filePath = file.response.data.tmp_path;
      const i = this.addGoodsForm.pics.findIndex((e) => (e.pic = filePath));
      this.addGoodsForm.pics.splice(i, 1);
      console.log(this.addGoodsForm.pics);
    },

    // 图片预览
    handlePreview(file) {
      console.log(file);
      this.picUrl = file.response.data.url;
      this.picDialogVisible = true;
    },

    //添加图片到表单
    getPicsList(res) {
      console.log(res);
      const pic = res.data.tmp_path;
      this.addGoodsForm.pics.push({ pic });
      console.log(this.addGoodsForm);
    },
  },

  // 计算商品分类id
  computed: {
    catId() {
      if (this.selectedKeys.length !== 3) {
        return (this.selectedKeys = []);
      }
      return this.selectedKeys[2];
    },
  },
  created() {
    this.getCatList();
  },
};
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 10px 0 !important;
}
</style>