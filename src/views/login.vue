<template>
  <div id=login>
    <div class="form">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item>
          <h2>
            用户登录
            <span>Login User</span>
          </h2>
        </el-form-item>
        <el-form-item label="账号" prop="user">
          <i class="el-icon-user"></i>
          <el-input type="number" v-model="ruleForm.user" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <i class="el-icon-lock"></i>
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loginStatu">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Base64 from '../util/Base64.js'
import Cookie from '../util/Cookie.js'
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      ruleForm: {//存储需要提交的表单信息
        user: "",//用户名
        pass: "",//密码
    },
    checked: false,//默认不记住密码
    loginStatu: false,//默认登录不是加载状态
	  // userToken: '',//存储令牌
    rules: {//定义表单验证的规则
      user: [
        { required: true, message: "请输入用户名", trigger: "blur" }
      ],
      pass: [{ required: true, message: "请输入密码", trigger: "blur" }
      ]
    }
    };
  },
  /**
   * 创建后
   */
  created(){
   if(Cookie.getCookie("name")&&Cookie.getCookie("password")){//当用户记住密码后cookie中有值时
   this.checked=true;//选中记住密码
    this.ruleForm.user = Base64.decode(Cookie.getCookie("name"));//对用户名进行解码
	  this.ruleForm.pass = Base64.decode(Cookie.getCookie("password"));
   }
  },
  methods: {
    /**
     * 表单提交
     * @param formName 需要提交的表单
     * @param userMobile 用户名
     * @param userPassword 用户密码
     */
    submitForm(formName) {
    // console.log(formName)
    var that = this; //把this指向的vue实例赋给that
    that.loginStatu=true;
    //根据组件名点出整个表单校验的方法
    that.$refs[formName].validate((valid) => {
      if(valid){//通过验证
          that.axios.get("OAuth/authenticate",{
          params:{
            userMobile: that.ruleForm.user,
            userPassword: that.ruleForm.pass
          }
        })
        .then(res => {
          that.loginStatu=false;
          // console.log(res);
          //存储后台返回的令牌信息
          let userToken=res.data.token_type+" "+res.data.access_token;
          sessionStorage.setItem("token",userToken);//存储令牌
          sessionStorage.setItem("uid",res.data.profile.userUid)//存储当前用户的唯一标识符
          sessionStorage.setItem("userName",res.data.profile.userName)//存储当前用户的名字
          that.$message.success('登录成功');
          Cookie.removeCookie("name");
          Cookie.removeCookie("password");
          if(that.checked){//记住密码时
            let user = Base64.encode(that.ruleForm.user);
            let pwd = Base64.encode(that.ruleForm.pass);
            Cookie.setCookie("name",user,{maxAge:60*60});
            Cookie.setCookie("password",pwd,{maxAge:60*60});
          }
          this.$router.replace("/home");
        })
        .catch((err)=>{
          setTimeout(function(){
             that.loginStatu=false
          },3000)
         
          // console.log(err.response)
          if(err.response.status==401){
            that.$message.error('用户名或密码不存在');
          }else{
            that.$message.error('系统错误')
          }
        });
      }else{
        that.$message.warning("请输入账户名和密码");
        return false;
      }
     })
		// // this.axios.get("OAuth/authenticate?userMobile=" +that.ruleForm.user +"&userPassword=" + that.ruleForm.pass )  
    }
  }
};
</script>

<style lang='less' scoped>
#login{
	background:url("../assets/bg.jpg") 0px 0px no-repeat;
	background-size: 100% 100%;
  width:100%;
  position:fixed;
	width:100%;
	height: 100%;
}
h2 {
  padding: 0;
  margin: 0;
}
h2 span {
  font-size: 18px;
  color: #666;
}
.form {
  width: 360px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white
}

/deep/ .el-form-item__content {
  margin-left: 0px !important;
}
/deep/ .el-form-item__label {
  width: 70px !important;
}
.el-input {
  width: 70%;
  position: relative;
}

/deep/ .el-form-item__error {
  position: absolute;
  top: 100%;
  left: 100px !important;
}
.el-form-item__label {
  padding: 0px;
}
.el-checkbox {
  display: block;
  width: 70%;
}
.el-button--primary {
  width: 70%;
  margin-left: 70px;
}
.el-icon-user,.el-icon-lock{
		font-size: 26px;
		position: absolute;
		top: 6px;
		left: 90px;
    z-index: 10;
    color:#ccc;
}
/deep/ .el-input__inner{
  padding-left: 30px;
}
</style>



