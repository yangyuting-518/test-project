<template>
  <div id="class">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button style="padding: 3px 0" type="text" @click="addClass()">
          新增班级
          <i class="el-icon-circle-plus-outline"></i>
        </el-button>
      </div>
      <el-dialog :title="dailogTitle?'增加班级':'修改班级信息'" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="form" v-if="dialogFormVisible">
          <el-form-item label="班级名称" :label-width="formLabelWidth" prop="className">
            <el-input v-model="form.className" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="专业名称" :label-width="formLabelWidth" prop="courseName">
            <el-select v-model="form.courseName" placeholder="请选择专业" @change="selectCourse()">
              <el-option
                v-for="item in courseData"
                :key="item.classCourseId"
                :value="item.courseName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="老师名称" :label-width="formLabelWidth" prop="userName">
            <el-select v-model="form.userName" placeholder="请选择老师" @change="selectTeacher()">
              <el-option v-for="item in teacherData" :key="item.userUid" :value="item.userName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('form')">取 消</el-button>
          <el-button type="primary" @click="submit?submitAdd('form'):submitUpdate('form')">确 定</el-button>
        </div>
      </el-dialog>
      <el-table
        :data="tableData"
        style="width: 100%;"
        height="430"
        :default-sort="{prop: 'index', order: 'descending'}"
      >
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="courseName" label="专业名称" sortable></el-table-column>
        <el-table-column prop="className" label="班级名称" sortable></el-table-column>
        <el-table-column prop="userName" label="老师名称" sortable></el-table-column>
        <el-table-column prop="classStudents" label="班级人数" sortable></el-table-column>
        <el-table-column label="创建日期" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.classCreateTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              :disabled="scope.row.classStudents>0?true:false"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from "@/util/data.js";
export default {
  data() {
    return {
      tableData: [], //存储表格中所有班级数据
      dailogTitle: true, // true时表单的标题是 增加班级， false 标题是 修改班级信息
      dialogFormVisible: false, //弹出框的显示与隐藏
      submit: true, //为true时，提交是增加班级的表单； false时，提交的是编辑班级的表单
      courseData: [], //所有课程的信息
      teacherData: [], //所有老师的名称
      form: {
        classId: 0, //班级主键编号
        className: "", //班级名称
        classTeacherId: "", //老师编号
        userName: "", //老师名称
        classCourseId: "", //专业编号
        courseName: "", //专业名称
        classStudents: "", //班级人数
        classCreateTime: "" //班级创建日期
      },
      index: 0, //保存编辑的信息在表格中的位置
      rules: {
        className: [
          { required: true, message: "请输入班级名称", trigger: "blur" }
        ],
        courseName: [
          { required: true, message: "请选择课程", trigger: "blur" }
        ],
        userName: [{ required: true, message: "请选择老师", trigger: "blur" }]
      },
      formLabelWidth: "120px" //表单的宽度
    };
  },
  created() {
    this.getClassData();
    this.getCourserData();
    this.getTeacherData();
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
          // console.log(res);
          that.tableData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 获取所有老师信息
     */
    getTeacherData() {
      let that = this;
      that.axios.get("User/GetTeachers").then(res => {
        that.teacherData = res.data;
        // console.log(that.teacherData);
      });
    },
    /**
     * 获取所有课程信息
     */
    getCourserData() {
      let that = this;
      that.axios.get("Class/GetAllCourse").then(res => {
        that.courseData = res.data;
        // console.log(that.courseData)
      });
    },
    /**
     * 查找所选择课程名称对应的课程编号
     */
    selectCourse() {
      let that = this;
      let course = that.courseData.find(item => {
        return that.form.courseName == item.courseName;
      });
      that.form.classCourseId = course.courseId;
      console.log(typeof that.form.classCourseId);
    },
    /**
     * 查找所选择老师对应的老师编号
     */
    selectTeacher() {
      let that = this;
      let teacher = that.teacherData.find(item => {
        return that.form.userName == item.userName;
      });
      that.form.classTeacherId = teacher.userId;
      console.log(that.form.userName)
    },
    /**
     * 点击增加班级弹出增加班级的表单
     */
    addClass() {
      let that = this;
      that.dialogFormVisible = true; //显示修改表单
      that.dailogTitle = true; //让表单标题显示为增加班级
      that.submit = true; //让提交的表单是增加班级的表单
      //初始化表单信息
      that.form.classId = 0;
      that.form.className = "";
      that.form.classTeacherId = "";
      that.form.userName = "";
      that.form.classCourseId = "";
      that.form.courseName = "";
      that.form.classStudents = "";
      that.form.classCreateTime = "";
    },
    /**
     * 提交增加班级的表单
     * @param {Obj} form 表单对象
     */
    submitAdd(form) {
      let that = this;
      // console.log(that.form.classCourseId);
      that.$refs[form].validate(valid => {
        if (valid) {
          that.axios
            .post("Class/AddClass", {
              className: that.form.className,
              classCourseId: that.form.classCourseId,
              classTeacherId: that.form.classTeacherId
            })
            .then(res => {
              // console.log(res);
              if (res.data.code == 1) {
                res.data.data.userName = that.form.userName;
                res.data.data.courseName = that.form.courseName;
                that.tableData.unshift(res.data.data); //得到数据库返回的新增班级信息，并添加到表格中
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
     * 修改表格中的数据
     * @param {Number,Obj}
     * index 当前行在表格中的位置 row当前行对象
     */
    handleEdit(index, row) {
      console.log(index, row);
      let that = this;
      that.dialogFormVisible = true; //显示修改表单
      that.dailogTitle = false; //让表单标题显示为修改班级信息
      that.submit = false; //让提交的表单是修改信息的表单
      that.form.classId = row.classId;
      that.form.className = row.className;
      that.form.courseName = row.courseName;
      that.form.userName = row.userName;
      that.form.classCourseId = row.classCourseId
      that.index = index;
    },
    /**
     * 提交修改班级信息的表单
     * @param {Obj} form 表单对象
     */
    submitUpdate(form) {
      let that = this;
      that.$refs[form].validate(valid => {
        if (valid) {
          console.log(111);
          console.log(that.form.classCourseId)
          that.axios
            .post("Class/ModifyClass", {
              classId: that.form.classId, //要修改的班级主键
              className: that.form.className, //要修改的班级名称
              classCourseId: that.form.classCourseId, //课程编号
              classTeacherId: that.form.classTeacherId //老师编号
            })
            .then(res => {
              // console.log(res);
              switch (res.data.code) {
                case 1:
                  //更改的数据实时更新到表格中
                  that.tableData[that.index].className = that.form.className;
                  that.tableData[that.index].courseName = that.form.courseName;
                  that.tableData[that.index].userName = that.form.userName;
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
     * 删除表格中的数据
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
          that.tableData.splice(index, 1);
          that.axios
            .get("Class/RemoveClass", { params: { classId: row.classId } })
            .then(res => {
              if (res.data.code == 1) {
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
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
}
.el-select {
  width: 100%;
}
</style>
