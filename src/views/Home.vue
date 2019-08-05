<template>
  <div id="home" style="height: 100%;">
    <el-container style="height: 100%;">
      <el-aside width="auto">
        <el-menu
          default-active
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#41B883"
          :default-openeds="['1','2']"
        >
          <el-menu-item class="title">
            <img src="../assets/logo.png" />
            <span slot="title">后台管理系统</span>
          </el-menu-item>
          <el-submenu v-for="(item,index) in list" :key="index" :index="index+1+''">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="(value,n) in item.sublist" :key="n" @click="addTab(value.name)">
                <router-link :to="value.subpath">{{value.name}}</router-link>
                <!-- <span class="checkIcon"></span> -->
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
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
              closable
              @tab-remove="removeTab"
              @tab-click="handleClick"
            >
              <el-tab-pane
                v-for="item in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              ></el-tab-pane>
            </el-tabs>
            <div class="userInfo">
              <el-avatar
                :size="50"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                style="margin-left: 15px"
              ></el-avatar>
              <span>张三</span>
            </div>
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
      isCollapse: false, //默认不折叠
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
            }
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
      editableTabsValue: "1",//绑定选中选项卡的name
      editableTabs: [],//存储新增标签页
      tabIndex: 1
    };
  },
  methods: {
    /**
     * 展开或折叠左侧导航栏
     */
    collapseStatus() {
      let that = this;
      that.isCollapse = !that.isCollapse;
    },
    /**动态增加标签 */
    addTab(targetName) {
      let that = this;
      let newTabName = ++that.tabIndex + "";
      that.editableTabsValue = newTabName;
      let tabName = []; //存储当前所有标签的tittle
      //判断当前打开的标签时候已经存在
      that.editableTabs.forEach(function(item) {
        tabName.push(item.title);
      });
      if (tabName.indexOf(targetName) == -1) {
        that.editableTabs.push({
          title: targetName,
          name: newTabName
        });
      }
    },
    /**点击标签跳转到左边对应路由 */
    handleClick(tab) {
		//   console.log(tab, event);
		let that = this;
		that.list.forEach(function(item){
			item.sublist.forEach(function(value){
				if(tab.label==value.name){
					that.$router.replace(value.subpath);
				}
			})
		})
    },
    /**删除标签页 */
    removeTab(targetName) {//targetName要删除的标签位置
    console.log(targetName)
      let tabs = this.editableTabs;//得到当前用户打开标签页的数组
      let activeName = this.editableTabsValue;//得到现在标签默认选中的位置
      console.log(targetName)
      if (activeName === targetName) {//当前标签选中的位置与要删除的位置相等
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {//如果tabs数组中元素的name与传入的要删掉的targetName相等，只得到满足条件的那一个元素
            let nextTab = tabs[index + 1] || tabs[index - 1];//就让当前元素的下标加一或减一
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);//过滤掉要删除的元素，实现删除的效果
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
  min-height: 400px;
  display: block;
  position: relative;
  left: 0;
  top: 0;
  bottom: 0;
}

.el-aside {
  height: 100%;
  background-color: #545c64;
  overflow: hidden;
  .el-menu{
    .el-menu-item {
    padding: 0!important;
    height: 60px !important;
    line-height: 60px;
    text-align: left;
    text-indent: 80px;
    /deep/&.title{
      text-align: left;
      text-indent: 0px;
      img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
      span{
        font-size: 20px;
        font-weight: bold;
      }
   }
   /deep/ .el-tooltip {
      left: -18px !important;
    }
  }
}
.el-submenu {
  /deep/.el-submenu__title {
    text-align: left;
    // text-indent: -70px;
    height: 60px !important;
    line-height: 60px;
    // .el-menu-item-group {
    //   .el-menu-item {
        
    //   }
    // }
  }
  a {
    text-decoration: none;
	  color: white;
	  display: block;
    &.router-link-active{
      background-color:#000;
      color: wheat;
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
    font-size: 25px;
  }
  .el-tabs {
    max-width: 70%;
    /deep/.el-tabs__header {
      margin: 0;
      .el-tabs__nav {
        border: 0;
        .el-tabs__item {
          color: white;
          border: 1px solid white;
          margin-right: 10px;
          &:first-child {
            border-left: 1px solid white;
          }
          &.is-active {
            color: wheat;
            border: 0;
            border: 1px solid wheat;
          }
        }
      }
    }
  }
  .userInfo {
    width: 120px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    // max-width: 10%;
    span {
      &:last-child {
        color: white;
        display: block;
      }
    }
  }
}

.el-main {
  padding: 0;
  .el-tabs--card {
    /deep/ & > .el-tabs__header {
      border-bottom: none;
    }
  }
}
</style>
