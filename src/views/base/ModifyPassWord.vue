<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin: 20px;">
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="margin-left:10px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="oldPass">
          <el-input type="text" v-model="ruleForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input type="text" v-model="ruleForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import { setTimeout } from "timers";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPass: "",
        newPass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newPass: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否要修改?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              axios
                .get("User/ModifyPassword", {
                  params: {
                    uid: sessionStorage.getItem("uid"),
                    oldPassword: that.ruleForm.oldPass,
                    newPassword: that.ruleForm.newPass
                  }
                })
                .then(res => {
                  console.log(res);
                  // code=0 数据没有任何变化 code=1 成功    code=-1 系统异常   code=-2 参数错误   code=其它错误
                  switch (res.data.code) {
                    case 0:
                      that.$message.info(res.data.message);
                      break;
                    case 1:
                      that.$message.success(res.data.message);
                      setTimeout(function() {
                        that.$router.replace("/"); //跳转到登录页面
                      }, 3000);
                      break;
                    case -1:
                      that.$message.warning(res.data.message);
                      break;
                    default:
                      that.$message.warning(res.data.message);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(() => {
              that.$message({
                type: "info",
                message: "已取消操作"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>