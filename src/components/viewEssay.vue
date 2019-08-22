<template>
  <div id="viewEssay">
    <el-card class="box-card">
      <!-- 选择题标题 -->
      <div slot="header" class="clearfix">
        <span>一、问答题（本题共{{essayInfo.length}}小题，共<el-badge :value='sumEssay+"/"+12' class="item"> </el-badge>分）</span>
      </div>
      <!-- 非编辑状态 -->
      <div v-for="(item,index) in essayInfo" :key="index">
        <template v-if="!item.isEdit">
          <el-form label-width="100px" class="demo-dynamic" @submit.native.prevent>
            <el-form-item class="title">
              <span>{{index+1}}、</span>
              {{item.tpqQuestion.questionTitle}}
              <el-input-number :min="2" :max="10" v-model="item.tpqScore" @change="changeScore(item)"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button disabled round>参考答案</el-button>
            </el-form-item>
            <el-form-item>
              {{item.tpqQuestion.answerQuestion.aqAnswer}}
            </el-form-item>
            <el-form-item>
              <el-button @click="editEssayQuestion(item)" round>编辑</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 编辑状态 -->
        <template v-if="item.isEdit">
          <el-form label-width="100px" class="demo-dynamic" @submit.native.prevent>
            <el-form-item class="title">
              <span>{{index+1}}、</span>
              <el-input v-model="item.tpqQuestion.questionTitle" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button disabled round>参考答案</el-button>
            </el-form-item>
            <el-form-item>
              <el-input v-model="item.tpqQuestion.answerQuestion.aqAnswer" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-form-item>
                <!-- <el-button @click="editChoice('editChoice')" round type="primary">编辑</el-button> -->
                <el-button @click="resetEssay(item,index)" round>取消</el-button>
                <el-button @click="saveHandel(item,index)" round type="primary">保存修改</el-button>
                <el-button @click="deletEssay(item,index)" round type="danger">删除项目</el-button>
              </el-form-item>
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
    props: ["question"], //父组件传过来的值
    data() {
      return {
        essayInfo: [], //所有问答题信息
        editEssayInfo: [] //原始的问答题信息
      }
    },
    created() {
      let that = this;
      //深度拷贝对象
      if (that.question) {
        that.essayInfo = JSON.parse(JSON.stringify(that.question));
        console.log(that.essayInfo);
      }
    },
    methods: {
      /**
       * 改变问答题分值
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
       * 编辑问答题信息
       *@params {Obj} e是当前选中的选择题对象
       */
      editEssayQuestion(e) {
        console.log(e)
        e.isEdit = true;
      },
      /**
       *取消编辑问答题
       *@params {Obj,Number} e是当前选中的选择题对象 index 当前编辑选择题在选择题数组中的下标
       */
      resetEssay(e, index) {
        //让单选题的数组回到初始值
        // console.log(e)
        let that = this;
        //深度拷贝对象,把更改之前的单选题信息拷贝给choices数组
        that.editEssayInfo = JSON.parse(JSON.stringify(that.question));
        that.essayInfo[index] = that.editEssayInfo[index];
        e.isEdit = false; //回到非编辑状态
        //迫使 Vue 实例重新渲染
        // that.$forceUpdate();
      },
      /**
       *保存修改选择题的信息
       *@params {Obj,Number} e是当前选中的选择题对象 index 当前编辑选择题在选择题数组中的下标
       */
      saveHandel(e, index) {
        console.log(index)
        let that = this;
        that.axios
          .post("TestPaper/ModifyQuestion", e.tpqQuestion)
          .then(res => {
            console.log(res);
            console.log(res.data.data);
            if (res.data.code == 1) {
              //把修改成功后的数据重新渲染到页面
              that.essayInfo[index].tpqQuestion.answerQuestion.aqAnswer = res.data.data.answerQuestion.aqAnswer;
              that.essayInfo[index].tpqQuestion.questionTitle = res.data.data.questionTitle;
              //回到非编辑时的状态
              e.isEdit = false;
              that.$message.success("编辑成功")
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      /**
       *删除当前题目
       *@params {Obj,Number} e是当前选中的选择题对象 index 当前编辑选择题在选择题数组中的下标
       */
      deletEssay(e, index) {
        console.log(e)
        let that = this;
        that.$confirm("是否要删除题目?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          that.axios.post("TestPaper/RemoveQuestionFromTestPaper",null, {
            params: {
              paperQuestionId: e.tpqId
            }
          }).then(res => {
            console.log(res);
            if (res.data.code == 1) {
              that.essayInfo.splice(index, 1)
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
    watch: {
      question(val) {
        // console.log(val)
        let that = this;
        if (val) {
          //深度拷贝对象
          that.essayInfo = JSON.parse(JSON.stringify(val));
        }
      }
    },
    computed:{
      //问答题总分数
      sumEssay() {
        let that = this;
        let sum = 0;
        that.essayInfo.forEach(item => {
          sum += item.tpqScore;
        });
        sessionStorage.setItem('sumEssay',sum)
        return sum;
      }
    }
  }

</script>

<style lang="less" scoped>
  #viewEssay {
    margin-top: 20px;

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
  }

</style>
