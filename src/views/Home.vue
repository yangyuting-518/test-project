<template>
  <div id="home" style="height: 100%;">
    <el-container>
      <el-aside width="auto">
        <!-- <div style="position:relative"> -->
          <!-- :default-active="$route.path"绑定档前激活菜单的index ,实现导航和页面同时变化 -->
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            background-color="#545c64"
            text-color="#fff"
            router
            active-text-color="#409eff"
            :default-openeds="['1','2']"
          >
            <el-menu-item class="title">
              <img src="../assets/logo.png" />
              <span slot="title">后台管理系统</span>
            </el-menu-item>
            <el-menu-item class="el_item">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu v-for="(item,index) in list" :key="index" :index="index+1+''">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="(value,n) in item.sublist"
                  :key="n"
                  @click="addTab(value)"
                  :index="value.subpath"
                >
                  <!-- <router-link :to="value.subpath">{{value.name}}</router-link> -->
                  {{value.name}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        <!-- </div> -->
      </el-aside>
      <el-main>
        <el-container>
          <el-header>
            <el-button @click="collapseStatus()">
              <i class="el-icon-s-fold" v-if="!isCollapse"></i>
              <i class="el-icon-s-unfold" v-else></i>
            </el-button>
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              @tab-click="handleClick"
              @tab-remove="removeTab"
            >
              <el-tab-pane
                v-for="(item,index) in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                :closable="index>0"
              ></el-tab-pane>
            </el-tabs>
            <el-dropdown>
              <span class="el-dropdown-link userInfo">
                <el-avatar :size="50" :src="avatar" style="margin-left: 15px"></el-avatar>
                {{user}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <!-- 下拉显示部分 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="handLogout()">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-header>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "home",
  components: {},
  data() {
    return {
      user: "",
      //   indexPath: "/home", //首页路径
      isCollapse: false, //默认不折叠
      realList: [], //保存面包屑导航中的路由
      avatar:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      openeds: [],
      list: [
        {
          title: "基础模块",
          sublist: [
            {
              name: "班级管理",
              subpath: "/ClassManage"
            },
            {
              name: "学生管理",
              subpath: "/StudentManage"
            },
            {
              name: "老师管理",
              subpath: "/TeacherManage"
            },
            {
              name: "修改密码",
              subpath: "/ModifyPassWord"
            },
            {
              name: "角色管理",
              subpath: "/RoleManage"
            },
          ]
        },
        {
          title: "在线测试",
          sublist: [
            {
              name: "老师出卷",
              subpath: "/MakeTestPaper"
            },
            {
              name: "试卷维护",
              subpath: "/MaintainTestPaper"
            },
            {
              name: "安排测试",
              subpath: "/ArrangeTest"
            },
            {
              name: "批阅试卷",
              subpath: "/CorrectTestPaper"
            },
            {
              name: "查看成绩",
              subpath: "/ViewScore"
            }
          ]
        }
      ],
      asideList: [], //保存左侧菜单栏信息
      editableTabsValue: "", //绑定选中标签页的路径
      editableTabs: [
        {
          title: "首页",
          name: "/home"
        }
      ] //存储打开的标签页
    };
  },
  created() {
    let that = this;
    that.list.forEach(function(item) {
      that.asideList.push(...item.sublist);
    });
    // 刷新后重新渲染用户打开的标签页
    let tabs = JSON.parse(sessionStorage.getItem("tabs"));
    let activeTab = sessionStorage.getItem("activeTab");
    if (tabs && activeTab) {
      this.editableTabs = tabs;
      this.editableTabsValue = activeTab;
      this.$router.replace(this.editableTabsValue);
    }
    if (sessionStorage.getItem("userName")) {
      this.user = sessionStorage.getItem("userName");
    }
  },
  methods: {
    /**
     * 展开或折叠左侧导航栏
     */
    collapseStatus() {
      let that = this;
      that.isCollapse = !that.isCollapse;
    },
    /**
     *动态增加标签
     *@params {String}
     * targetName是传入的左侧菜单栏的标题
     */
    addTab(targetName) {
      // console.log(targetName);
      let that = this;
      let newTabName = targetName.subpath; //绑定当前打开菜单的路径到tag标签页上
      that.editableTabsValue = newTabName;
      let existence = that.editableTabs.findIndex(item => {
        return item.title == targetName.name;
      }); //使用findIndex 方法查找打开的标签页里面有没有要打开的目标标签;
      if (existence == -1) {
        that.editableTabs.push({
          title: targetName.name,
          name: newTabName
        });
      } else {
        //如果要打开的目标标签页已经在打开的标签页数组中，就让选中标签变成目标标签
        that.editableTabsValue = that.editableTabs[existence].name;
      }
      sessionStorage.setItem("tabs", JSON.stringify(that.editableTabs));
      sessionStorage.setItem("activeTab", that.editableTabsValue);
    },
    /*
			*点击标签跳转到左边对应路由
			@params {obj}
			tab 标签页的信息
			*/
    handleClick(tab) {
      // console.log(tab)
      let that = this;
      that.asideList.forEach(item => {
        if (tab.label == item.name) {
          that.$router.replace(tab.paneName);
        }
      });
      sessionStorage.setItem("activeTab", that.editableTabsValue);
    },
    /*
			*删除标签页 
			@params string
			targetName 是标签页的name值
			*/
    removeTab(targetName) {
      //targetName要删除的标签位置
      // console.log(targetName);
      let that = this;
      let tabs = that.editableTabs; //得到当前用户打开标签页的数组
      let activeName = that.editableTabsValue; //得到现在标签默认选中的位置
      if (activeName === targetName) {
        //当前标签选中打开的位置与要删除的位置相等
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            //如果tabs数组中元素的name与传入的要删掉的targetName相等，只得到满足条件的那一个元素
            let nextTab = tabs[index + 1] || tabs[index - 1]; //就让当前元素的下标加一或减一
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      that.editableTabsValue = activeName;
      let index1 = tabs.findIndex(item => {
        return item.name == targetName;
      }); //当前要删除的标签在打开标签数组中的下标
      // this.editableTabs = tabs.filter(tab => tab.name !== targetName);//过滤掉要删除的元素，实现删除的效果,tab是editableTabs的元素
      that.asideList.find(item => {
        return item.name == tabs[index1 - 1].title;
      });
      tabs.splice(index1, 1);
      that.editableTabs = tabs;
      that.$router.replace(activeName); //使用element的 v-model绑定的 选中的选项卡来进行路由跳转
      //保存用户当前操作，保存打开的标签页数组，及当前所在的标签页
      sessionStorage.setItem("tabs", JSON.stringify(that.editableTabs));
      sessionStorage.setItem("activeTab", that.editableTabsValue);
    },
    handLogout() {
      this.$confirm("确认退出吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //清除缓存
        sessionStorage.clear();
        this.$router.replace("/");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  display: block;
  position: relative;
  left: 0;
  top: 0;
  bottom: 0;
}

.el-aside {
  // height: 100%;
  background-color: #545c64;
  // overflow: hidden;
  .el-menu {
    border-right: 0;
    /deep/.el-menu-item {
      padding: 0 !important;
      height: 60px !important;
      line-height: 60px;
      text-align: left;
      text-indent: 50px;
      &.is-active {
        color: #409eff;
        background-color: #000 !important;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          top: 9px;
          right: 0;
          width: 0;
          height: 0;
          border: 20px solid transparent;
          border-right: 20px solid #fff;
        }
      }
      &.el_item {
        text-indent: 0px;
        font-size: 16px;
        padding-left: 20px !important;
        background-color: #545c64 !important;
        &.is-active {
          &::after {
            border: 0;
          }
        }
      }
      &.title {
        text-align: left;
        text-indent: 0px;
        color: white;
        // background-color: #545c64 !important;
        &.is-active {
          &::after {
            border: 0;
          }
        }
        img {
          width: 60px;
          height: 60px;
        }
        .el-tooltip {
          padding: 0 !important;
        }
        span {
          font-size: 21px;
          font-weight: bold;
        }
      }
    }
    .el-submenu {
      /deep/.el-submenu__title {
        text-align: left;
        font-size: 16px;
        height: 60px;
        line-height: 60px;
      }
      a {
        text-decoration: none;
        color: white;
        display: block;
        &.router-link-active {
          background-color: #000;
        }
      }
    }
  }
}

.el-header {
  padding: 0;
  text-align: left;
  background: #545c64;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-button {
    height: 60px;
    margin-right: 10px;
    font-size: 25px;
    padding: 0;
  }
  /deep/.el-tabs--card {
    flex: 1;
    overflow: hidden;
    .el-tabs__header {
      margin: 15px 0 0;
      border-bottom: 0;
      .el-tabs__nav {
        border-bottom: 1px solid white;
        .el-tabs__item {
          border-bottom: 1px solid white;
          height: 42px;
          color: white;
          &.is-active {
            border-bottom-color: #545c64;
            color: #409eff;
          }
        }
      }
    }
  }
  .userInfo {
    width: 200px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: white;
    span {
      display: block;
    }
  }
}

.el-main {
  padding: 0;
  // &:last-child{
  //   overflow: hidden;
  // }
  
}
.el-container {
  &:first-child{
    height: 100%;
  }
  
}
</style>
