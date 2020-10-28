<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col class="title" :span="12" align="left"> 管理锤子系统 </el-col>
        <el-col class="user" :span="12" align="right">
          <span
            >{{ userInfo.username }}
            <el-button
              type="info"
              @click="logout"
              size="mini"
              style="margin: 10px"
              >退出</el-button
            >
          </span>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-col :span="24">
          <el-menu
            :default-active="activeUrl"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true"
            align="left"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="iconfont icon-yonghu"></i>
                <span>账户管理</span>
              </template>
              <el-menu-item index="/user">
                <template slot="title">
                  <i class="iconfont icon-042fangkuai"></i>
                  <span>账户信息</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="iconfont icon-quanxian"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="/role">
                <template slot="title">
                  <i class="iconfont icon-042fangkuai"></i>
                  <span>角色列表</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/private">
                <template slot="title">
                  <i class="iconfont icon-042fangkuai"></i>
                  <span>权限列表</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="iconfont icon-shangpin"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="/goods_params">
                <template slot="title">
                  <i class="iconfont icon-042fangkuai"></i>
                  <span>商品列表</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/categories">
                <template slot="title">
                  <i class="iconfont icon-042fangkuai"></i>
                  <span>商品分类</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/goods_detail">
                <template slot="title">
                  <i class="iconfont icon-042fangkuai"></i>
                  <span>参数列表</span>
                </template>
              </el-menu-item>
              <!-- 
              <el-menu-item index="/private">
                <template slot="title">
                  <i class="iconfont icon-042fangkuai"></i>
                  <span>权限列表</span>
                </template>
              </el-menu-item>-->
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="iconfont icon-dingdan-"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index>
                <template slot="title">
                  <i class="iconfont icon-042fangkuai"></i>
                  <span>账户信息</span>
                </template>
              </el-menu-item>
              <el-menu-item index>
                <template slot="title">
                  <i class="iconfont icon-042fangkuai"></i>
                  <span>账户信息</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="iconfont icon-shuju"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item index="/reports">
                <template slot="title">
                  <i class="iconfont icon-042fangkuai"></i>
                  <span>数据图</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      activeUrl: "",
      userInfo: {},
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    logout() {
      localStorage.removeItem("userInfo");
      this.$router.push("/login");
    },
  },
  created() {
    this.activeUrl = this.$router.history.current.fullPath;
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(this.userInfo);
  },
};
</script>
<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: rgb(248, 244, 244);
  height: 8.5vh !important;
  line-height: 8.5vh;
}
.title {
  font-size: 38px;
  font-weight: 600px;
  color: rgb(71, 67, 66);
  text-shadow: 5px 5px 5px #ffffff;
}
.user {
  padding-right: 40px;
}
.iconfont {
  padding-right: 5px;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}
.el-container {
  height: 91.5vh;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

.el-menu-item {
  min-width: 100% !important;
}
</style>