<template>
  <div id="makeTestPaper">
    <!-- <h1>试卷出题</h1> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线测试</el-breadcrumb-item>
      <el-breadcrumb-item>老师出卷</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-steps :active="active" finish-status="success">
          <el-step title="试卷信息"></el-step>
          <el-step title="添加题目"></el-step>
          <el-step title="完成制作"></el-step>
        </el-steps>
      </div>
      <el-form :model="form" :rules="rules" ref="form" v-show="active==0" class="testInfo">
        <el-form-item label="试卷名称" :label-width="formLabelWidth" prop="paperName">
          <el-input v-model="form.paperName" autocomplete="off" placeholder="请输入试卷名称"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" :label-width="formLabelWidth" prop="courseName">
          <edit-course v-model="form.courseId"></edit-course>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-top: 12px;" @click="next" type="primary">下一步</el-button>
        </el-form-item>
      </el-form>
      <div v-show="active==1">
        <div class="questionType">
          <span>题目类型</span>
          <el-radio-group v-model="radio">
            <el-radio :label="1">选择题</el-radio>
            <el-radio :label="2">填空题</el-radio>
            <el-radio :label="3">问答题</el-radio>
          </el-radio-group>
        </div>
        <!-- 试卷编辑 -->
        <!-- :testPaperId="testPaperId" -->
        <edit-single-choice :radio="radio" v-if="radio==1" @saved="handleCq"></edit-single-choice>
        <edit-fill-question v-if="radio==2" ></edit-fill-question>
        <edit-essay-question v-if="radio==3" @setEssayData="getEssayData"></edit-essay-question>
      </div>
      <!-- 试卷预览 -->
      <template>
        <view-choice v-bind:choice-question="choiceQuestion"></view-choice>
        <!-- v-if="choiceQuestion.length>0" -->
        <view-essay v-bind:question="question"></view-essay>
      </template>
    </el-card>
  </div>
</template>

<script>
  import EditCourse from "@/components/EditCourse";
  import EditSingleChoice from "@/components/EditSingleChoice";
  import EditEssayQuestion from "@/components/EditEssayQuestion";
  import EditFillQuestion from "@/components/EditFillQuestion";
  import viewChoice from "@/components/viewChoice";
  import viewEssay from "@/components/viewEssay";


  export default {
    components: {
      EditCourse,
      EditSingleChoice,
      EditEssayQuestion,
      EditFillQuestion,
      viewChoice,
      viewEssay
    },
    data() {
      return {
        active: 1, //表明步骤的index
        radio: 1, //默认选中的单选按钮
        // testPaperId: 0,
        form: {
          paperName: "", //试卷名称
          courseId: 0 //课程Id
        },
        rules: { //表单验证规则
          paperName: [{
            required: true,
            message: "请输入试卷名称",
            trigger: "blur"
          }],
          courseName: [{
            required: true,
            message: "请选择课程",
            trigger: "blur"
          }]
        },
        formLabelWidth: "120px", //表单的宽度
        testPaper: [], //存储试卷中所有题目的信息
        testPaperId: 0 //试卷编号
      };
    },
    mounted() {
      this.getPaperInfo()
    },
    methods: {
      /**
       *提交试卷信息
       */
      next() {
        let that = this;
        let uid = sessionStorage.getItem("uid");
        that.axios
          .post("TestPaper/MakeTestPaper?uid=" + uid, {
            TpTitle: that.form.paperName,
            TpCourseId: that.form.courseId //课程ID
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              // sessionStorage.setItem("testPaperId",res.data.data.testPaperId)
              that.testPaperId = res.data.data.testPaperId;
              if (this.active++ > 2) this.active = 0;
            }
            that.alertMassage(res.data.code, res.data.message);
          })
          .catch(err => {
            console.log(err);
          });
      },
      /**
       * 获取试卷信息
       */
      getPaperInfo() {
        let that = this;
        that.axios
          .get('TestPaper/GetTestPaper', {
            params: {
              id: 3175
            }
          })
          .then(res => {
            console.log(res)
            console.log(res.data)
            that.testPaper = res.data.questions;
            //给每道题目对象加一个是否编辑的属性，默认非编辑状态
            if (that.testPaper) {
              that.testPaper.forEach(element => {
                element.isEdit = false;
              });
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      /**
       * 处理增加单选题的子组件传过来的数据
       */
      handleCq(e) {
        console.log(e)
        this.testPaper.push(e);
        console.log(this.testPaper)
      },
      /**
       * 处理增加问答题的子组件传过来的数据
       */
       getEssayData(e) {
        console.log(e);
        this.testPaper.push(e);
        // console.log(this.testPaper)
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
    computed: {
      /**
       * 过滤所有选择题题目
       */
      choiceQuestion() {
        if (this.testPaper) {
          return this.testPaper.filter(item => {
            return item.tpqQuestion.questionTypeId == 1;
          })
        }
      },
      /**
       * 过滤所有填空题题目
       */
      fillQuestion() {
        if (this.testPaper) {
          return this.testPaper.filter(item => {
            return item.tpqQuestion.questionTypeId == 2;
          })
        }
      },
      /**
       * 过滤所有问答题题目
       */
      question() {
        if (this.testPaper) {
          return this.testPaper.filter(item => {
            return item.tpqQuestion.questionTypeId == 3;
          })
        }
      },
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

    .el-card__body {
      /deep/.testInfo {
        width: 60%;
        margin: auto;

        .el-form-item__label {
          width: 100% !important;
          text-align: left;
        }

        .el-form-item__content {
          margin-left: 0 !important;
        }
      }

      .questionType {
        text-align: left;
        padding-bottom: 10px;

        &>span {
          margin-right: 100px;
        }
      }
    }
  }

  .clearfix {
    text-align: left;

    .el-steps {
      width: 90%;
      margin: 0 auto;
    }
  }

</style>
