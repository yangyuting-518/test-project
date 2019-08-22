<template>
  <div id="viewChoice">
    <el-card class="box-card">
      <!-- 选择题标题 -->
      <div slot="header" class="clearfix">
        <span>一、选择题（本题共{{choiceInfo.length}}小题，共
          <el-badge :value='sumChoice+"/"+totalScore' class="item"> </el-badge>
          分）
        </span>
      </div>
      <!-- 非编辑状态 -->
      <div v-for="(item,index) in choiceInfo" :key="index">
        <template v-if="!item.isEdit">
          <el-form label-width="100px" class="demo-dynamic" @submit.native.prevent>
            <el-form-item class="title">
              <span>{{index+1}}、</span>
              {{item.tpqQuestion.questionTitle}}
              <el-input-number :min="2" :max="10" v-model="item.tpqScore" @change="changeScore(item)"></el-input-number>
            </el-form-item>
            <el-form-item v-for="(option,indexs) in item.tpqQuestion.chooseQuestion" :key="indexs">
              <el-checkbox disabled :checked="option.cqIsRight">{{optionOrder[indexs]}}、</el-checkbox>
              <span>{{option.cqOption}}</span>
            </el-form-item>
            <el-form-item>
              <el-button @click="editchoiceQuestion(item)" round>编辑</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 编辑状态 -->
        <template v-if="item.isEdit">
          <el-form ref="choiceForm" label-width="100px" class="demo-dynamic" @submit.native.prevent>
            <el-form-item class="title">
              <span>{{index+1}}、</span>
              <el-input v-model="item.tpqQuestion.questionTitle" type="textarea"></el-input>
            </el-form-item>
            <el-form-item v-for="(option,indexs) in item.tpqQuestion.chooseQuestion" :key="indexs">
              <el-checkbox v-model="option.cqIsRight">{{optionOrder[indexs]}}、</el-checkbox>
              <el-input v-model="option.cqOption"></el-input>
              <el-button type="danger" icon="el-icon-delete" circle @click.prevent="removeOption(item,option)"
                v-show="item.tpqQuestion.chooseQuestion.length>2"></el-button>
            </el-form-item>
            <el-form-item>
              <!-- <el-button @click="editChoice('editChoice')" round type="primary">编辑</el-button> -->
              <el-button @click="resetChioce(item,index)" round>取消</el-button>
              <el-button @click="addOptions(item,index)" round type="primary"
                :disabled="item.tpqQuestion.chooseQuestion.length>=optionOrder.length">新增选项
              </el-button>
              <el-button @click="saveHandel(item,index)" round>保存修改</el-button>
              <el-button @click="deletChoice(item,index)" round type="danger">删除项目</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    //props中的数据只能读取
    props: ["choiceQuestion"], //父组件传过来的值
    data() {
      return {
        choiceInfo: [], //编辑状态下所有单选题信息
        optionOrder: ["A", "B", "C", "D", "E"], //选项字母序号
        choices: [], //原始的单选题信息
        totalScore: 12
      }
    },
    created() {
      let that = this;
      //深度拷贝对象
      if (that.choiceQuestion) {
        that.choiceInfo = JSON.parse(JSON.stringify(that.choiceQuestion));
        // console.log(that.choiceInfo);
      }
    },
    methods: {
      /**
       * 改变单选题分值
       *@params {Obj} 当前选中的单选题
       */
      changeScore(item) {
        // console.log(item)
        let that = this;
        that.axios.post("TestPaper/ModifyScore", {
          tpqId: item.tpqId,
          tpqScore: item.tpqScore
        }).then(res => {
          if (res.data.code == 1) {
            that.$message.success("分值修改成功")
          }
        }).catch(err => {
          console.log(err)
        })
      },
      /**
       * 编辑选择题信息
       *@params {Obj} e是当前选中的选择题对象
       */
      editchoiceQuestion(e) {
        console.log(e)
        e.isEdit = true;
      },
      /**
       *取消编辑选择题
       *@params {Obj,Number} e是当前选中的选择题对象 index 当前编辑选择题在选择题数组中的下标
       */
      resetChioce(e, index) {
        //让单选题的数组回到初始值
        console.log(e)
        let that = this;
        //深度拷贝对象,把更改之前的单选题信息拷贝给choices数组
        that.choices = JSON.parse(JSON.stringify(that.choiceQuestion));
        that.choiceInfo[index] = that.choices[index];
        e.isEdit = false; //回到非编辑状态
        // that.$forceUpdate();
      },
      /**
       *新增单选题选项
       *@params {Obj,Number} e是当前选中的选择题对象 index 当前编辑选择题在选择题数组中的下标
       */
      addOptions(e, index) {
        let that = this;
        e.tpqQuestion.chooseQuestion.push({
          cqOption: "",
          cqIsRight: false
        })
      },
      /**
       *删除单选题选项
       *@params {Obj,Obj} item 一个选择题对象 option 选项对象
       */
      removeOption(item, option) {
        console.log(item, option);
        let index = item.tpqQuestion.chooseQuestion.indexOf(option);
        if (index != -1) {
          item.tpqQuestion.chooseQuestion.splice(index, 1)
        }
        console.log(item.tpqQuestion.chooseQuestion)
      },
      /**
       *保存修改选择题的信息
       *@params {Obj,Number} e是当前选中的选择题对象 index 当前编辑选择题在选择题数组中的下标
       */
      saveHandel(e, index) {
        let that = this;
        let bool = false; //判断是否有选项框勾选上
        e.tpqQuestion.chooseQuestion.forEach(item => {
          if (item.cqIsRight) { //选项框勾选上
            bool = true;
          }
        });
        if (bool) {
          that.axios
            .post("TestPaper/ModifyQuestion", e.tpqQuestion)
            .then(res => {
              console.log(res);
              console.log(res.data.data);
              if (res.data.code == 1) {
                //把修改成功后的数据重新渲染到页面
                that.choiceInfo[index].chooseQuestion = res.data.data.chooseQuestion;
                that.choiceInfo[index].questionTitle = res.data.data.questionTitle;
                that.$message.success("编辑成功")
              }
              //回到非编辑时的状态
              e.isEdit = false;
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          that.$message.error("必选勾选一个答案");
        }
      },
      /**
       *删除当前题目
       *@params {Obj,Number} e是当前选中的选择题对象 index 当前编辑选择题在选择题数组中的下标
       */
      deletChoice(e, index) {
        let that = this;
        that.$confirm("是否要删除题目?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          that.axios.post("TestPaper/RemoveQuestionFromTestPaper", null, {
            params: {
              paperQuestionId: e.tpqId
            }
          }).then(res => {
            console.log(res);
            if (res.data.code == 1) {
              that.choiceInfo.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          }).catch(err => {
            console.log(err)
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    computed: {
      //选择题总分数
      sumChoice() {
        let that = this;
        let sum = 0;
        that.choiceInfo.forEach(item => {
          sum += item.tpqScore;
        });
        return sum;
      }
    },
    //监听从父组件传过来的对象 choiceQuestion
    watch: {
      choiceQuestion(val) {
        // console.log(val)
        if (val) {
          let that = this;
          //深度拷贝对象
          that.choiceInfo = JSON.parse(JSON.stringify(val));
        }
      }
    }
  }

</script>

<style lang="less" scoped>
  /deep/.el-form-item__content {
    text-align: left;
    margin-left: 28px !important;
    display: flex;
  }

  /deep/ .title {
    &>.el-form-item__content {
      margin-left: 0 !important;

      .el-input-number {
        margin-left: 10px;
      }
    }
  }

  .clearfix {
    text-align: left;
  }

</style>
