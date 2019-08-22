<template>
  <div id="addQuestion">
    <el-form :model="choiceForm" ref="choiceForm" label-width="100px" class="demo-dynamic">
      <el-form-item prop="title" label="题干" :rules="[
      { required: true, message: '请输入题目', trigger: 'blur' }
    ]">
        <el-input v-model="choiceForm.title" type="textarea"></el-input>
      </el-form-item>
      <el-form-item v-for="(option, index) in choiceForm.options" :key="index" :prop="'options.' + index + '.cqOption'"
        :rules="{required: true, message: '选项不能为空', trigger: 'blur'}">
        <el-checkbox v-model="option.cqIsRight">
          {{optionList[index]}}、
        </el-checkbox>
        <el-input v-model="option.cqOption"></el-input>
        <el-button type="danger" icon="el-icon-delete" circle @click.prevent="removeOption(option)"
          v-show="choiceForm.options.length>2"></el-button>
      </el-form-item>
      <el-form-item label="分值">
        <el-input-number v-model="choiceForm.num" :min="2" :max="10" label="描述文字"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('choiceForm')" round>重置</el-button>
        <el-button @click="addOption()" type="info" round :disabled="choiceForm.options.length>=optionList.length">新增选项
        </el-button>
        <el-button round @click="submitForm('choiceForm')" type="primary"><i class="el-icon-document-checked"></i>保存题目
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    // "testPaperId",
    props: ["radio"],
    data() {
      return {
        optionList: ["A", "B", "C", "D", "E"], //选项字母序号
        choiceForm: {
          //存储题目信息
          options: [{
              cqOption: "", //input框输入内容
              cqIsRight: false //多选框选择状态
            },
            {
              cqOption: "",
              cqIsRight: false
            },
            {
              cqOption: "",
              cqIsRight: false
            },
            {
              cqOption: "",
              cqIsRight: false
            }
          ],
          title: "", //题干内容
          num: 2, //分值
        }
      };
    },
    methods: {
      /**
       * 提交表单
       */
      submitForm(formName) {
        let that = this;
        // console.log(that.choiceForm.testPaperId)
        // // console.log(that.radio)
        that.$refs[formName].validate(valid => {
          if (valid) {
            //通过验证
            let bool = false; //判断是否有选项框勾选上
            that.choiceForm.options.forEach(item => {
              if (item.cqIsRight) { //选项框勾选上
                bool = true;
              }
            });
            if (bool) {
              that.axios
                .post("TestPaper/AddQuestionToTestPaper", {
                  tpqPaperId: 3175, //试卷主键编号sessionStorage.getItem("testPaperId")
                  tpqScore: that.choiceForm.num, //分值
                  tpqQuestion: {
                    questionTitle: that.choiceForm.title, //题目的标题
                    questionTypeId: that.radio, //题目的类型 1=选择题 2=填空题 3=问答题
                    chooseQuestion: that.choiceForm.options //选项内容
                  }
                })
                .then(res => {
                  console.log(res);
                  console.log(res.data.data);
                  //提交成功后重置表单
                  if (res.data.code == 1) {
                    let innitChoiceForm = {
                      options: [{
                          cqOption: "", //input框输入内容
                          cqIsRight: false //多选框选择状态
                        },
                        {
                          cqOption: "",
                          cqIsRight: false
                        },
                        {
                          cqOption: "",
                          cqIsRight: false
                        },
                        {
                          cqOption: "",
                          cqIsRight: false
                        }
                      ],
                      title: "", //题干内容
                      num: 2 //分值
                    };
                    that.choiceForm = innitChoiceForm;
                    res.data.data.isEdit = false
                    that.$emit("saved", res.data.data); //向父组件传递已经添加的题目信息
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              that.$message.error("必选勾选一个答案");
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      /**
       * 重置表单
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
        let initOptions = [{
            cqOption: "", //input框输入内容
            cqIsRight: false //多选框选择状态
          },
          {
            cqOption: "",
            cqIsRight: false
          }
        ]
        this.choiceForm.options = initOptions;
      },
      /**
       * 减少选项
       *@params {Obj} item 选项对象
       */
      removeOption(item) {
        var index = this.choiceForm.options.indexOf(item);
        if (index !== -1) {
          this.choiceForm.options.splice(index, 1);
        }
      },
      /**
       * 增加选项
       */
      addOption() {
        let that = this;
        that.choiceForm.options.push({
          cqOption: "",
          cqIsRight: false
        });
      }
    }
  }

</script>

<style lang="less" scoped>
  /deep/ .el-form-item__content {
    display: flex;
    margin-left: 43px !important;

    .el-checkbox {
      margin-right: 11px;
    }

    .el-input {
      margin-right: 10px;
    }

    .el-button {
      &:first-child {
        margin-left: 57px;
      }
    }
  }

</style>
