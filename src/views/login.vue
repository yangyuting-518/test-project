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
          <el-input type="number" v-model="ruleForm.user" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="ruleForm.checked">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="ruleForm.loginStatu">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Base64 from '../util/Base64.js'
import Cookie from '../util/Cookie.js'
export default {
  data() {
    return {
      ruleForm: {
        user: "",
        pass: "",
        checked: true,
        loginStatu: false
	  },
	  userToken: '',
      rules: {
        user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created(){
	  //如果有记住密码，下次登录直接从cookie中 拿数据
	  this.ruleForm.user = Base64.decode(Cookie.getCookie("name"));
	  this.ruleForm.pass = Base64.decode(Cookie.getCookie("password"));
	// console.log(Base64.decode(Cookie.getCookie("password"))) 
  },
  methods: {
    submitForm(formName) {
		this.ruleForm.loginStatu=true;
		var that = this;
		this.axios.get("OAuth/authenticate?userMobile=" +that.ruleForm.user +"&userPassword=" + that.ruleForm.pass )
		.then(res => {
			console.log(res);
			if(res.status==200){
				that.userToken=res.data.token_type+" "+res.data.access_token;
				this.$message.success('登录成功');
				if(this.ruleForm.checked){
					//先移除在加入，确保只有一个用户名和账户存入
					Cookie.removeCookie("name");
					Cookie.removeCookie("password");
					let user = Base64.encode(this.ruleForm.user);
					let pwd = Base64.encode(this.ruleForm.pass);
					Cookie.setCookie("name",user,{maxAge:60*60});
					Cookie.setCookie("password",pwd,{maxAge:60*60});
				};
				this.$router.push("/");
			}
		})
		.catch((err)=>{
			this.ruleForm.loginStatu=false;
			console.log(err);
			if(res.status==401){
				this.$message.console.error('用户名或密码不存在');
			}else{
				this.$message.error('系统错误')
			}
		});
       
    }
  }
};
</script>

<style scoped lang='less'>
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
  // &:nth-child(4){
  // 	line-height: 20px;
  // }
}
/deep/ .el-form-item__label {
  width: 70px !important;
}
.el-input {
  width: 70%;
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
</style>



