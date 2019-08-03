<template>
	<div id="home">
		<el-container style="height: 100%;">
			<el-aside width="auto">
				<el-menu default-active class="el-menu-vertical-demo" :collapse="isCollapse" background-color="#545c64" text-color="#fff"
				 active-text-color="#41B883" router :default-openeds="['1','2']">
					<el-menu-item>
						<img src="../assets/logo.png" />
						<span slot="title">后台管理系统</span>
					</el-menu-item>
					<el-submenu v-for="(item,index) in list" :key="index" :index="index+1+''">
						<template slot="title">
							<i class="el-icon-menu"></i>
							<span>{{item.title}}</span>
						</template>
						<el-menu-item-group v-for="(value,n) in item.sublist" :key="n">
							<el-menu-item :index="value.subpath" @click="addTab(value.name)">{{value.name}}</el-menu-item>
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
						<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="handleClick">
							<el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name"></el-tab-pane>
						</el-tabs>
						<div class="userInfo">
							<el-avatar :size="50" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" style="margin-left: 15px"></el-avatar>
							<span> 张三</span>
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
				list: [{
						title: "基础模块",
						sublist: [{
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
							}
						]
					},
					{
						title: "在线测试",
						sublist: [{
								name: "出卷",
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
				editableTabsValue: "1",
				editableTabs: [ //存放新增的标签
					{
						title: "首页",
						name: "1"
					}
				],
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
				if (tabName.indexOf(targetName)==-1) {
					that.editableTabs.push({
						title: targetName,
						name: newTabName
					});
				}
			},
			handleClick() {
        		console.log(tab, event);
      		},
			removeTab(targetName) {
				let tabs = this.editableTabs;
				let activeName = this.editableTabsValue;
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}
				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.name !== targetName);
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
		.el-menu-item {
			height: 60px !important;
			line-height: 60px;
			text-align: left;
			img {
				width: 60px;
				height: 60px;
			}
			/deep/ &:first-child {
				// padding-left: 0 !important;
				.el-tooltip {
					left: -20px !important;
				}
			}
		}
		/deep/.el-submenu__title {
			text-align: left;
			height: 60px !important;
			line-height: 60px;
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
		.el-tabs--card {
			/deep/&>.el-tabs__header {
				.el-tabs__nav{
					border: 0;
					border-bottom: 0;
					/deep/ .el-tabs__item {
						color: white ;
						border: 0;
						border: 1px solid white;
						border-right: 0;
						/deep/ &.is-active {
							color:wheat;
							border: 0;
							border: 1px solid wheat;
						}
					}
				}
			}
		}
		/deep/.el-tabs__item{
			color: white;
			border: 1px solid white;
		}

		.userInfo {
			display: flex;
			align-items: center;

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
			/deep/ &>.el-tabs__header {
				border-bottom: none;
				.el-tabs__nav {
					// border-bottom: 1px solid #e4e7ed;
				}
			}
		}
	}
</style>
