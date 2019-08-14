<template>
  <div id="role">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button style="padding: 3px 0" type="text" @click="addRole()">
          新增角色
          <i class="el-icon-circle-plus-outline"></i>
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;"
        :default-sort="{prop: 'index', order: 'ascending'}"
      >
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="userTypeTypeName" label="角色名称" sortable></el-table-column>
        <el-table-column prop="userTypeId" label="角色ID" sortable></el-table-column>
        <el-table-column label="操作" width="180" fixed="right" prop="disable">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              :disabled="scope.row.disable"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增/编辑角色信息 -->
      <el-dialog
        :title="dailogTitle?'增加角色':'修改角色信息'"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="form" :rules="rules" ref="form" v-if="dialogFormVisible">
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="userTypeTypeName">
            <el-input v-model="form.userTypeTypeName" autocomplete="off"></el-input>
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
    return {
      tableData: [], //存储表格中所有角色数据
      dailogTitle: true, // true时表单的标题是 增加角色， false 标题是 修改角色信息
      dialogFormVisible: false, //弹出框的显示与隐藏
      submit: true, //为true时，提交是增加角色的表单； false时，提交的是编辑角色信息的表单
      form: {
        userTypeTypeName: "", //角色名称
        disable: false, //是否禁用删除按钮
        userTypeId: 1 //编号
      },
      rules: {
        userTypeTypeName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px" ,//表单的宽度
      index: 0, //保存编辑的信息在表格中的位置
    };
  },
  created() {
    this.getRoleData();
  },
  methods: {
    /**
     * 得到所有角色的数据
     */
    getRoleData() {
      let that = this;
      that.axios
        .get("UserType/GetUserRoles")
        .then(res => {
          //   console.log(res);
          that.tableData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 增加角色
     */
    addRole() {
      let that = this;
      that.dailogTitle = true; //表单标题显示 增加角色
      that.dialogFormVisible = true; //显示弹出表单
      that.submit = true; //提交增加表单信息
      //初始化form
      that.form.userTypeTypeName = "";
      that.form.disable = false;
      that.form.userTypeId = 1;
    },
    /**
     * 提交增加角色表单
     * @param {Obj} form 表单对象
     */
    submitAdd(form) {
      let that = this;
      that.$refs[form].validate(valid => {
        if (valid) {
          that.axios
            .post("UserType/AddUserRole", null, {
              params: {
                userRoleName: that.form.userTypeTypeName
              }
            })
            .then(res => {
              // console.log(res);
              that.dialogFormVisible = false;
              that.tableData.unshift(res.data.data);
              // code=0 数据没有任何变化 code=1 成功    code=-1 系统异常   code=-2 参数错误   code=其它错误
              that.alertMassage(res.data.code, res.data.message);
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
      // console.log(row);
      let that = this;
      that
        .$confirm("确定要删除?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that.axios
            .post("UserType/RemoveUserRole", null, {
              params: {
                userRoleId: row.userTypeId
              }
            })
            .then(res => {
              // console.log(res);
              that.tableData.splice(index, 1);
              that.alertMassage(res.data.code, res.data.message);
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
     * 编辑当前行信息
     * @param {Number,Object}
     * index 当前行在表格中的位置 row 当前行的所有信息
     */
    handleEdit(index, row) {
      // console.log(row);
      let that = this;
      that.dailogTitle = false; //表单标题显示为修改角色信息
      that.dialogFormVisible = true; //弹出表单
      that.submit = false; //让提交的表单是修改角色信息表单
      that.form.userTypeId = row.userTypeId;
      that.form.userTypeTypeName = row.userTypeTypeName;
      that.index = index;
    },
    /**
     * 提交修改角色表单
     * @param {Obj} form 表单对象
     */
    submitUpdate(form) {
      let that = this;
      that.$refs[form].validate(valid => {
        if (valid) {
          //通过表单验证
          that.axios
            .post("UserType/ModifyUserRole", null, {
              params: {
                id: that.form.userTypeId,
                userRoleName: that.form.userTypeTypeName
              }
            })
            .then(res => {
              // console.log(res);
              that.tableData[that.index].userTypeTypeName = that.form.userTypeTypeName;
              that.alertMassage(res.data.code, res.data.message);
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
     * 取消时重置表单
     * @param {Obj} form 整个表单
     */
    resetForm(form) {
      this.$refs[form].resetFields();
      this.dialogFormVisible = false;
    },
    /**
     * 提示信息
     * @param {Number,Obj}
     * code 接口返回的code msg接口返回的提示信息
     */
    alertMassage(code, msg) {
      // code=0 数据没有任何变化 code=1 成功    code=-1 系统异常   code=-2 参数错误   code=其它错误
      let that = this;
      switch (code) {
        case 0:
          that.$message.info(msg);
          break;
        case 1:
          that.$message.success(msg);
          break;
        case -1:
          that.$message.error(msg);
          break;
        case -2:
          that.$message.error(msg);
          break;
        default:
          that.$message.error(msg);
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
</style>
