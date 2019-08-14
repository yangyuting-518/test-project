<template>
  <div id="teacher">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>老师管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button style="padding: 3px 0" type="text" @click="addTeacher()">
          新增老师
          <i class="el-icon-circle-plus-outline"></i>
        </el-button>
        <!-- 单选按钮组 -->
        <el-radio-group v-model="radio" @change="tableData=filterData">
          <el-radio
            v-for="(item,index) in radioData"
            :key="index"
            :label="item.userTypeTypeName"
          >{{item.userTypeTypeName}}</el-radio>
        </el-radio-group>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;"
        :default-sort="{prop: 'index', order: 'ascending'}"
      >
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="userName" label="老师名称" sortable></el-table-column>
        <el-table-column prop="userSex" label="性别" sortable></el-table-column>
        <el-table-column prop="userMobile" label="手机号" sortable></el-table-column>
        <el-table-column prop="userPassword" label="密码" sortable></el-table-column>
        <el-table-column prop="userTypeTypeName" label="角色" sortable></el-table-column>
        <el-table-column label="操作" width="180" fixed="right" prop="disableDelete">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              :disabled="scope.row.disableDelete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增/编辑老师信息 -->
      <el-dialog
        :title="dailogTitle?'增加老师':'修改老师信息'"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="form" :rules="rules" ref="form" v-if="dialogFormVisible">
          <el-form-item label="老师名称" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="form.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth" prop="userSex">
            <el-radio v-model="form.userSex" label="男">男</el-radio>
            <el-radio v-model="form.userSex" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="userMobile">
            <el-input v-model="form.userMobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="userPassword">
            <el-input v-model="form.userPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth" prop="userUserTypeId">
            <el-select
              v-model="form.userTypeTypeName"
              placeholder="请选择角色"
              @change="selectUserType()"
            >
              <el-option
                v-for="(item,index) in userTypeData"
                :key="index"
                :value="item.userTypeTypeName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('form')">取 消</el-button>
          <el-button type="primary" @click="submit?submitAdd('form'):submitUpdate('form')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!/^1\d{10}$/.test(this.form.userMobile)) {
        callback(new Error("手机号长度必须是11位"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!/^\w{6,18}$/.test(this.form.userPassword)) {
        callback(new Error("密码至少6位，不能超过18位"));
      } else {
        callback();
      }
    };
    return {
      tableData: [], //存储表格中所有老师数据
      userTypeData: [], //存储用户角色信息
      dailogTitle: true, // true时表单的标题是 增加老师， false 标题是 修改老师信息
      dialogFormVisible: false, //弹出框的显示与隐藏
      submit: true, //为true时，提交是增加老师的表单； false时，提交的是编辑老师信息的表单
      form: {
        userId: 0, //主键编号
        userUid: "", //标识符
        userMobile: "", //手机号
        userName: "", //老师名称
        userSex: "", //性别
        userPassword: "", //密码
        userUserTypeId: "", //角色编号
        userTypeTypeName: "", //角色
        disableDelete: false //禁用删除 true：禁用 false：可用
      },
      index: 0, //保存编辑的信息在表格中的位置
      rules: {
        //表单验证规则
        userName: [
          { required: true, message: "请输入老师名称", trigger: "blur" }
        ],
        userSex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        userMobile: [
          { required: true, validator: validateMobile, trigger: "blur" }
        ],
        userPassword: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        userUserTypeId: [
          { required: true, message: "请输入角色", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px", //表单的宽度
      filterTable: [], //过滤后的表格
      radioData: [
        //单选按钮数据
        { userTypeTypeName: "全部" }
      ],
      radio: "全部" //默认选中全部单选按钮
    };
  },
  created() {
    this.getTeachersData();
    this.getUserTypeData();
  },
  methods: {
    /**
     * 得到所有老师的数据
     */
    getTeachersData() {
      let that = this;
      that.axios
        .get("User/GetTeachers")
        .then(res => {
          // console.log(res);
          that.tableData = res.data;
          that.filterTable = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 得到所有用户角色的数据
     */
    getUserTypeData() {
      let that = this;
      that.axios
        .get("UserType/GetUserRoles")
        .then(res => {
          // console.log(res);
          that.userTypeData = res.data;
          that.radioData.push(...res.data); //把所有的角色信息存储到单选按钮数组中
          // console.log(that.radioData)
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 查找所选角色对应的角色ID
     */
    selectUserType() {
      let that = this;
      let user = that.userTypeData.find(item => {
        return that.form.userTypeTypeName == item.userTypeTypeName;
      });
      // console.log(user);
      that.form.userUserTypeId = user.userTypeId;
    },
    /**
     * 新增老师信息
     */
    addTeacher() {
      let that = this;
      that.dailogTitle = true; //表单标题显示为新增老师
      that.dialogFormVisible = true; //弹出表单
      that.submit = true; //让提交的表单是新增老师表单
      //初始化表单信息
      that.form.userId = 0;
      that.form.userUid = "";
      that.form.userMobile = "";
      that.form.userName = "";
      that.form.userSex = "";
      that.form.userPassword = "";
      that.form.userUserTypeId = "";
      that.form.userTypeTypeName = "";
    },
    /**
     * 提交新增老师表单
     * @param {Obj} form 表单对象
     */
    submitAdd(form) {
      let that = this;
      that.$refs[form].validate(valid => {
        if (valid) {//通过表单验证
          // console.log(111);
          this.axios
            .post("User/AddTeacher", {
              userName: that.form.userName,
              userMobile: that.form.userMobile,
              userSex: that.form.userSex,
              userPassword: that.form.userPassword,
              userUserTypeId: that.form.userUserTypeId
            })
            .then(res => {
              console.log(res);
              // code=0 数据没有任何变化 code=1 成功    code=-1 系统异常   code=-2 参数错误   code=其它错误
              if (res.data.code == 1) {
                res.data.data.userTypeTypeName = that.form.userTypeTypeName;
                res.data.data.disableDelete = that.form.disableDelete;
                that.tableData.unshift(res.data.data);
                that.$message.success(res.data.message);
              }
              that.dialogFormVisible = false;
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 编辑当前行信息
     * @param {Number,Object}
     * index 当前行在表格中的位置 row 当前行的所有信息
     */
    handleEdit(index, row) {
      console.log(row);
      let that = this;
      that.dailogTitle = false; //表单标题显示为修改老师信息
      that.dialogFormVisible = true; //弹出表单
      that.submit = false; //让提交的表单是修改老师信息表单
      that.form.userName = row.userName;
      that.form.userSex = row.userSex;
      that.form.userMobile = row.userMobile;
      that.form.userPassword = row.userPassword;
      that.form.userTypeTypeName = row.userTypeTypeName;
      that.form.userUid = row.userUid;
      that.index = index;
    },
    /**
     * 提交修改老师表单
     * @param {Obj} form 表单对象
     */
    submitUpdate(form) {
      let that = this;
      that.$refs[form].validate(valid => {
        if (valid) {
          //通过表单验证
          that.axios
            .post("User/ModifyTeacher", {
              userUid: that.form.userUid,
              userName: that.form.userName,
              userMobile: that.form.userMobile,
              userSex: that.form.userSex,
              userUserTypeId: that.form.userUserTypeId,
              userPassword: that.form.userPassword
            })
            .then(res => {
              // console.log(res);
              // code=0 数据没有任何变化 code=1 成功    code=-1 系统异常   code=-2 参数错误   code=其它错误
              switch (res.data.code) {
                case 1:
                  that.tableData[that.index].userName = that.form.userName;
                  that.tableData[that.index].userMobile = that.form.userMobile;
                  that.tableData[that.index].userSex = that.form.userSex;
                  that.tableData[that.index].userPassword =
                    that.form.userPassword;
                  that.tableData[that.index].userTypeTypeName =
                    that.form.userTypeTypeName;
                  that.$message.success(res.data.message);
                  that.dialogFormVisible = false;
                  break;
                case -2:
                  that.$message.error(res.data.message);
                  break;
                case 0:
                  that.$message.info(res.data.message);
                  break;
                default:
                  that.$message.error(res.data.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 删除当前行
     * @param {Number,Object}
     * index 当前行在表格中的位置 row 当前行的所有信息
     */
    handleDelete(index, row) {
      let that = this;
      that
        .$confirm("确定要删除?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that.axios
            .post("User/RemoveTeacher", null, {
              params: {
                uid: row.userUid
              }
            })
            .then(res => {
              console.log(res);
              that.tableData.splice(index, 1);
              console.log(res.data.message);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * 取消时重置表单
     * @param {Obj} form 整个表单
     */
    resetForm(form) {
      this.$refs[form].resetFields();
      this.dialogFormVisible = false;
    }
  },
  computed: {
    /**
     * 按单选按钮的值筛选老师
     */
    filterData() {
      let that = this;
      if (that.radio == "全部") {
        return (that.tableData = that.filterTable);
      } else {
        return that.filterTable.filter(item => {
          return item.userTypeTypeName == that.radio;
        });
        // console.log(that.radio)
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.el-breadcrumb {
  margin: 20px;
}
/deep/ .el-card {
  max-width: 97%;
  max-height: 99%;
  margin: 0 auto;
  .el-table {
    .cell {
      text-align: center;
    }
  }
}
.clearfix {
  text-align: left;
  .el-radio-group {
    margin-left: 40px;
  }
}
.el-select {
  width: 100%;
}
.el-dialog {
  .el-dialog__body {
    .el-form {
      /deep/ .el-form-item {
        .el-form-item__content {
          text-align: left;
        }
      }
    }
  }
}
</style>
