<template>
  <div id="selectCourse">
    <el-select v-model="courseName" @change="selectCourse()">
      <el-option v-for="item in courseData" :key="item.classCourseId" :value="item.courseName"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  // name:editCourse,
  props:{
    courseId:Number
  },
  model:{
    prop:'courseId',
    event:'setCourseId'
  },
  data() {
    return {
      courseData: [], //存储课程
      courseName:"请选择课程",//课程名称
    };
  },
  mounted(){
      this.getCourserData();
  },
  methods: {
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
    selectCourse(){
      let that = this;
      let course = that.courseData.find(item => {
        return that.courseName == item.courseName;
      });
      // console.log(that.form.classCourseId);
      that.$emit('setCourseId',course.courseId)
    }
  }
};
</script>

<style lang="less" scoped>
.el-select {
  width: 100%;
}
</style>