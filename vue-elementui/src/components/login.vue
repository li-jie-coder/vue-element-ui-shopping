<template>
  <div class="log_container">
    <div class="box">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="psw">
          <el-input type="password" v-model="ruleForm.psw"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleForm)"
            >登录</el-button
          >
          <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        psw: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        psw: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      console.log(formName);
      this.axios
        .post("/login", { username: formName.name, password: formName.psw })
        .then((res) => {
          console.log(res.data.data);
          if (res.data.meta.status == 200) {
            const { token } = res.data.data;
            const userInfo = JSON.stringify(res.data.data);

            console.log(token);
            sessionStorage.setItem("token", token);
            localStorage.setItem("userInfo", userInfo);
            this.$router.push("/home");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scope>
.log_container {
  width: 100%;
  height: 100vh;
  background-color: #00b5e5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  width: 530px;
  height: 330px;
  background-color: #fff;
  display: flex;
  padding: 20px;
  flex-direction: column;
  justify-content: space-around;
}
</style>