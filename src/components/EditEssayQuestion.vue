<template>
  <div id="addEssayQuestion">
    <el-form :model="questionForm" ref="questionForm" label-width="100px" class="demo-dynamic">
      <el-form-item
        prop="title"
        label="题干"
        :rules="[
      { required: true, message: '请输入题目', trigger: 'blur' }
    ]"
      >
        <el-input v-model="questionForm.title" type="textarea"></el-input>
      </el-form-item>
      <el-form-item
        prop="answer"
        label="参考答案"
        :rules="[
      { required: true, message: '请输入参考答案', trigger: 'blur' }
    ]"
      >
        <el-input v-model="questionForm.answer" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="分值">
        <el-input-number v-model="questionForm.num" :min="5" :max="10" label="描述文字"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button round @click="resetForm('questionForm')">重置</el-button>
        <el-button round type="primary" @click="submitForm('questionForm')">
          <i class="el-icon-document-checked"></i>新增题目
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionForm: {
        //问答题表单
        title: "", //问题描述
        answer: "", //题目参考答案
        num: 5 //保存分值
      }
    };
  },
  methods: {
    /**
     * 重置表单
     * @param {Obj} formName 新增题目表单对象
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     * 新增题目
     * @param {Obj} formName 新增题目表单对象
     */
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          that.axios
            .post("TestPaper/AddQuestionToTestPaper", {
              tpqPaperId: 3175, //试卷主键编号
              tpqScore: that.questionForm.num, //分值
              tpqQuestion: {
                questionTitle: that.questionForm.title, //题目的标题
                questionTypeId: 3, //题目的类型 1=选择题 2=填空题 3=问答题
                answerQuestion: {
                  aqAnswer: that.questionForm.answer //问答题的答案
                }
              }
            })
            .then(res => {
              console.log(res);
              if (res.data.code == 1) {
                let inintQuestion = {
                  title: "", //问题描述
                  answer: "", //题目参考答案
                  num: 5 //保存分值
                };
                that.questionForm = inintQuestion;//初始化问题表单
                res.data.data.isEdit = false;
                that.$emit("setEssayData", res.data.data); //向父组件传递已经添加的题目信息
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
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.el-form-item__content {
  margin-left: 0;
  text-align: left;
}
</style>