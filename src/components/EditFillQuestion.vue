<template>
  <div id="addFill">
    <el-form :model="fillForm" ref="fillForm" label-width="100px" class="demo-dynamic">
      <el-form-item label="题干">
        <el-button round @click="addFills('fillForm')">
          <i class="el-icon-document-checked"></i>插入填空
        </el-button>
      </el-form-item>
      <el-form-item prop="title" :rules="[
        { required: true, message: '请输入题目', trigger: 'blur' }
      ]">
        <el-input v-model="fillForm.questionTitle" type="textarea"></el-input>
      </el-form-item>
      <el-form-item v-for="(item, index) in fillForm.fillQuestion" :key="index"
        :prop="'fillQuestion.' + index + '.fqAnswer'" :rules="{
        required: true, message: '内容不能为空', trigger: 'blur'
      }" class="gapFill">
        <el-badge :value="index+1" class="item">
        </el-badge>
        <el-input v-model="item.fqAnswer"></el-input>
        <el-input-number v-model="item.fillQuestionScore[0].fqsScore" :min="2" :max="10" label="描述文字"></el-input-number>
      </el-form-item>
      <el-form-item label="题目预览">
        <p v-for="(item,index) in gapAnswer" :key="index">
          {{ item }}
          <template v-if="fillForm.fillQuestion[index]">
            <span>{{fillForm.fillQuestion[index].fqAnswer}}</span>
            ({{ fillForm.fillQuestion[index].fillQuestionScore[0].fqsScore }}分)
          </template>
        </p>
      </el-form-item>
      <el-form-item>
        <el-button round @click="resetForm('fillForm')">重置</el-button>
        <el-button round type="primary" @click="submitForm('fillForm')">
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
        fillForm: {
          questionTitle: "", //填空题题干
          num: 2, //填空中的分值
          fillQuestion: [{
            //"fqOrder": 1, //填空序号
            "fqAnswer": "行级标签", //第一个空的答案
            "fillQuestionScore": [{
              "fqsScore": 2 //第一个空的分值
            }]
          }] //所有填空信息的集合
        },
        gapAnswer: [] //插入空格后，拆分的所有题干的信息的集合
      }
    },
    methods: {
      /**
       * 增加填空题中空格内容
       */
      addFills() {
        this.fillForm.fillQuestion.push({
          fqAnswer: "", //第一个空的答案
          fillQuestionScore: [{
            fqsScore: 0 //第一个空的分值
          }]
        })
      },
      /**
       * 重置表单
       * @param {Obj} form 整个表单对象
       */
      resetForm(form) {
        this.$refs[form].resetFields();
        this.fillForm.fillValue.splice(0);
      },
      /**
       * 提交表单
       * @param {Obj} form 整个表单对象
       */
      submitForm(form) {

      }
    }
  }

</script>

<style scoped lang="less">
  /deep/.el-form-item {
    &:first-child {
      margin-bottom: 0px;

      .el-form-item__content {
        display: flex;
      }
    }
  }

  /deep/.gapFill {
    .el-form-item__content {
      margin-left: 0 !important;

      .el-badge {
        padding-right: 12px;
        margin-left: 67px;
      }

      .el-input {
        .el-input__inner {
          border-left: 0;
          border-right: 0;
          border-top: 0;
          border-radius: 0;
        }
      }

      .el-input-number {
        .el-input__inner {
          border-bottom: 0;
          border: 1px solid #DCDFE6;
          border-radius: 4px;
        }
      }
    }


  }

  /deep/.el-form-item__content {
    display: flex;
  }

</style>
