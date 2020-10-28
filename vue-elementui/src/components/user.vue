<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
      <el-breadcrumb-item>账户信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="search_box">
        <el-input
          placeholder="请输入内容"
          v-model="input"
          clearable
          @input="search"
        ></el-input>
        <el-button type="primary" @click="dialogdisplay = true"
          >添加用户</el-button
        >
        <el-dialog title="添加用户" :visible.sync="dialogdisplay" width="50%">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm.username" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogdisplay = false">取 消</el-button>
            <el-button type="primary" @click="adduser">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <el-table :data="users" border style="width: 180">
        <el-table-column
          type="index"
          label="#"
          width="70"
          align="center"
        ></el-table-column>
        <!-- <el-table-column label="日期" width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.create_time | dateFormate }}</p>
        </template>
      </el-table-column>-->
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="email"></el-table-column>
        <el-table-column label="权限">
          <template slot-scope="scope">
            <el-switch
              @change="changestatus(scope.row)"
              v-model="scope.row.mg_state"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="iconfont icon-xiugai"
              circle
              @click="getusersdetail(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="iconfont icon-iconzhuanqu_shanchu"
              circle
              @click="deleteuser(scope.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" :enterable="false" placement="top">
              <el-button
                type="warning"
                icon="iconfont icon-shezhi"
                circle
                @click="changerole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="收货地址" :visible.sync="editDialogVisible">
        <el-form ref="editform" :model="editform" :rules="rules">
          <el-form-item label="用户名" prop="username" label-width="100px">
            <el-input v-model="editform.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="email" prop="email" label-width="100px">
            <el-input v-model="editform.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile" label-width="100px">
            <el-input v-model="editform.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeuser('editform')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisivle"
        width="50%"
      >
        <div>
          <p>当前用户：{{ userinfo.username }}</p>
          <p>当前角色：{{ userinfo.role_name }}</p>
        </div>
        分配新角色：
        <el-select v-model="selsectedId" placeholder="请选择">
          <el-option
            v-for="item in selectList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisivle = false">取 消</el-button>
          <el-button type="primary" @click="setRole()">确 定</el-button>
        </span>
      </el-dialog>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 2, 3, 4, 5]"
          :page-size="userQuery.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "alluser",
  data() {
    return {
      userQuery: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      users: [],
      input: "",
      total: 0,
      currentPage: 1,
      dialogdisplay: false,
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 8,
            message: "长度在 3 到 8 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 8,
            message: "长度在 3 到 8 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: false, message: "请输email", trigger: "blur" },
          {
            min: 3,
            max: 8,
            message: "长度在 3 到 8 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: false, message: "请输电话号码", trigger: "blur" },
          {
            min: 3,
            max: 8,
            message: "号码不正确",
            trigger: "blur",
          },
        ],
      },
      editform: {
        username: "",
        email: "",
        mobile: "",
      },
      editDialogVisible: false,
      setRoleDialogVisivle: false,
      userinfo: {},
      selectList: "",
      selsectedId: "",
    };
  },

  methods: {
    handleSizeChange(val) {
      this.userQuery.pagesize = val;
      this.getusers();
    },
    handleCurrentChange(val) {
      this.userQuery.pagenum = val;
      this.getusers();
    },
    search() {
      this.userQuery.query = this.input;
      this.getusers();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getusers() {
      this.axios
        .get("/users", { params: this.userQuery })
        .then((res) => {
          // console.log(res);
          this.total = res.data.data.total;
          this.users = res.data.data.users;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async adduser() {
      const { data: res } = await this.axios.post("/users", this.ruleForm);
      if (res.meta.status != 201) {
        this.$message.error("添加失败");
      } else {
        this.$message.success("添加成功");
        this.getusers();
      }
      this.ruleForm = {};
      this.dialogdisplay = false;
    },
    async changestatus(user) {
      const { data: res } = await this.axios.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      if (res.meta.status != 200) {
        user.mg_state = !user.mg_state;
        this.$message.error("修改失败");
      }
    },
    async getusersdetail(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.axios.get(`users/${id}`);
      this.editform = res.data;
    },
    changeuser(formName) {
      this.$refs[formName].validate(async (valid) => {
        console.log(valid);
        if (valid) {
          const { data: res } = await this.axios.put(
            `users/${this.editform.id}`,
            {
              email: this.editform.email,
              mobile: this.editform.mobile,
            }
          );
          if (res.meta.status != 200) {
            return this.$message.error("请求失败");
          }
          this.editform = {};

          this.getusers();
          this.editDialogVisible = false;
          this.$message.success("修改成功");
        } else {
          return this.$message.error("请按要求输入");
          return false;
        }
      });
    },
    deleteuser(id) {
      this.$confirm("此操作将永久删除该选项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.axios.delete(`users/${id}`);
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.getusers();
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
    async changerole(row) {
      this.setRoleDialogVisivle = true;
      this.userinfo = row;
      this.axios.get("roles").then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("请求失败");
        }
        this.selectList = res.data.data;
      });
    },
    async setRole() {
      const { data: res } = await this.axios.put(
        `users/${this.userinfo.id}/role`,
        {
          rid: this.selsectedId,
        }
      );

      if (res.meta.status !== 200) {
        this.selsectedId = "";

        return this.$message.error("请求失败");
      }
      this.$message.success("修改成功");
      this.selsectedId = "";
      this.getusers();
      this.setRoleDialogVisivle = false;
    },
  },
  created() {
    this.getusers();
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