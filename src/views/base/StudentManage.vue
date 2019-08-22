<template>
  <div id="student">
    <!-- <h1>学生管理</h1> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-select v-model="value.className" filterable placeholder="请选择" @change="selectClass()">
          <el-option v-for="item in classData" :key="item.classId" :value="item.className"></el-option>
        </el-select>
        <el-button style="padding: 3px 0" type="text" @click="addStudent()">
          新增学生
          <i class="el-icon-circle-plus-outline"></i>
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;"
        :default-sort="{prop: 'index', order: 'ascending'}"
      >
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="className" label="班级名称" sortable></el-table-column>
        <el-table-column prop="stuName" label="学生姓名" sortable></el-table-column>
        <el-table-column prop="stuAge" label="学生年龄" sortable></el-table-column>
        <el-table-column label="生日" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.stuBirthDay | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stuMobile" label="手机号" sortable></el-table-column>
        <el-table-column prop="stuSex" label="性别" sortable></el-table-column>
        <el-table-column prop="stuPassword" label="密码" sortable></el-table-column>
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
      <!-- 新增/编辑学生信息 -->
      <el-dialog
        :title="dailogTitle?'增加学生':'修改学生信息'"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="form" :rules="rules" ref="form" v-if="dialogFormVisible">
          <el-form-item label="学生名称" :label-width="formLabelWidth" prop="stuName">
            <el-input v-model="form.stuName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="班级名称" :label-width="formLabelWidth" prop="className">
            <el-select v-model="form.className" placeholder="请选择班级" @change="selectClassName()">
              <el-option v-for="item in classData" :key="item.classId" :value="item.className"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日" :label-width="formLabelWidth" prop="stuBirthDay">
            <el-date-picker v-model="form.stuBirthDay" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="stuMobile">
            <el-input v-model.number="form.stuMobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="stuPassword">
            <el-input v-model="form.stuPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth" prop="userSex">
            <el-radio v-model="form.stuSex" label="男">男</el-radio>
            <el-radio v-model="form.stuSex" label="女">女</el-radio>
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
import { formatDate } from "@/util/data.js";
export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!/^1\d{10}$/.test(this.form.stuMobile)) {
        callback(new Error("手机号长度必须是11位"));
      } else {
        callback();
      }
    };
    return {
      tableData: [], //存储表格中所有学生数据
      classData: [], //存储班级信息
      value: {
        className: "",
        classId: ""
      }, //默认选中的班级
      dailogTitle: true, // true时表单的标题是 增加老师， false 标题是 修改老师信息
      dialogFormVisible: false, //弹出框的显示与隐藏
      submit: true, //为true时，提交是增加老师的表单； false时，提交的是编辑老师信息的表单
      form: {
        stuUid: "", //学生唯一标识符
        className: "", //所在班级名称
        classId: "", //班级编号
        stuName: "", //学生姓名
        stuAge: "", //学生年龄
        stuBirthDay: "", //生日
        stuMobile: "", //手机号
        stuSex: "", //性别
        stuPassword: "" //密码
      },
      index: 0, //保存编辑的信息在表格中的位置
      rules: {
        className: [
          {
            required: true,
            message: "请输入班级名称",
            trigger: ["blur", "change"]
          }
        ],
        stuName: [
          { required: true, message: "请输入学生名称", trigger: "blur" }
        ],
        stuMobile: [
          { required: true, validator: validateMobile, trigger: "blur" }
        ],
        stuBirthDay: [
          { required: true, message: "请输入生日", trigger: "blur" }
        ],
        stuPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ],
        stuSex: [{ required: true, message: "请选择性别", trigger: "change" }]
      },
      formLabelWidth: "120px" //表单的宽度
    };
  },
  created() {
    this.getClassData();
  },
  methods: {
    /**
     * 从数据库中获取所有班级的数据
     */
    getClassData() {
      let that = this;
      that.axios
        .get("Class/GetAllClass")
        .then(res => {
          console.log(res);
          that.classData = res.data;
          //默认选中第一个班级
          that.value.className = that.classData[0].className;
          that.value.classId = that.classData[0].classId
          that.getStudentData();
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 得到所选班级的学生数据
     */
    getStudentData() {
      let that = this;
      that.axios
        .get("Student/GetClassStudent", {
          params: {
            classId: that.value.classId
          }
        })
        .then(res => {
          console.log(res);
          that.tableData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 查找所选班级对应的ID
     */
    selectClass() {
      let that = this;
      let grade = that.classData.find(item => {
        return that.value.className == item.className;
      });
      console.log(grade);
      that.value.classId = grade.classId;
      that.getStudentData();
    },
    /**
     * 新增学生信息
     */
    addStudent() {
      let that = this;
      that.dailogTitle = true; //表单标题显示为新增学生
      that.dialogFormVisible = true; //弹出表单
      that.submit = true; //让提交的表单是新增学生表单
      //初始化表单信息
      that.form.stuUid = "";
      that.form.className = "";
      that.form.classId = 0;
      that.form.stuName = "";
      that.form.stuAge = 0;
      that.form.stuBirthDay = "";
      that.form.stuMobile = "";
      that.form.stuSex = "";
      that.form.stuPassword = "";
    },
    /**
     * 新增/编辑学生时，查找对应班级的ID
     */
    selectClassName() {
      let that = this;
      let grade = that.classData.find(item => {
        return that.form.className == item.className;
      });
      that.form.classId = grade.classId;
      // console.log(that.form.classId)
    },
    /**
     * 提交新增学生表单
     * @param {Obj} form 表单对象
     */
    submitAdd(form) {
      let that = this;
      that.$refs[form].validate(valid => {
        if (valid) {
          // console.log(111);
          this.axios
            .post("Student/AddStudent", {
              stuName: that.form.stuName,
              stuClassId: that.form.classId,
              stuBirthDay: that.form.stuBirthDay,
              stuMobile: that.form.stuMobile,
              stuPassword: that.form.stuPassword,
              stuSex: that.form.stuSex
            })
            .then(res => {
              console.log(res);
              // code=0 数据没有任何变化 code=1 成功    code=-1 系统异常   code=-2 参数错误   code=其它错误
              if (res.data.code == 1) {
                if (that.value.className == that.form.className) {//当前用户查询的班级和用户添加进去的班级相同时
                  res.data.data.className = that.form.className;
                  that.tableData.push(res.data.data);
                }
              }
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
     * 编辑当前行信息
     * @param {Number,Object}
     * index 当前行在表格中的位置 row 当前行的所有信息
     */
    handleEdit(index, row) {
      // console.log(row);
      let that = this;
      that.dailogTitle = false; //表单标题显示为修改学生信息
      that.dialogFormVisible = true; //弹出表单
      that.submit = false; //让提交的表单是修改学生信息表单
      that.index = index;
      that.form.stuUid = row.stuUid;
      that.form.stuName = row.stuName;
      that.form.className = row.className;
      that.form.stuBirthDay = row.stuBirthDay;
      that.form.classId = row.classId;
      that.form.stuMobile = row.stuMobile;
      that.form.stuPassword = row.stuPassword;
      that.form.stuSex = row.stuSex;
    },
    /**
     * 提交修改学生表单
     * @param {Obj} form 表单对象
     */
    submitUpdate(form) {
      let that = this;
      that.$refs[form].validate(valid => {
        if (valid) {
          //通过表单验证
          that.axios
            .post("Student/ModifyStudent", {
              stuUid: that.form.stuUid,
              stuName: that.form.stuName,
              stuBirthDay: that.form.stuBirthDay,
              stuClassId: that.form.classId,
              stuMobile: that.form.stuMobile,
              stuPassword: that.form.stuPassword,
              stuSex: that.form.stuSex
            })
            .then(res => {
              console.log(res);
              if (res.data.code == 1) {
                if(that.form.className == that.value.className) {//当前用户查询的班级和用户添加进去的班级相同时
                  that.tableData[that.index].stuName = that.form.stuName;
                  that.tableData[that.index].stuBirthDay =
                    that.form.stuBirthDay;
                  that.tableData[that.index].stuMobile = that.form.stuMobile;
                  that.tableData[that.index].stuPassword =
                    that.form.stuPassword;
                  that.tableData[that.index].stuSex = that.form.stuSex;
                }else{//如果修改了班级名称
                  that.tableData.splice(that.index, 1);
                }
              }
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
            .get("Student/RemoveStudent", {
              params: {
                uid: row.stuUid
              }
            })
            .then(res => {
              // console.log(res);
              if (res.data.code == 1) {
                that.tableData.splice(index, 1);
              }
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
  },
  // 格式化时间
  filters: {
    /**
     * 日期时间转换函数
     * @param {String} time 传入的日期时间
     */
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
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
  &:last-child {
    width: 100%;
  }
}
.el-date-editor.el-input {
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
