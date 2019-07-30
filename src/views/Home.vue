<template>
  <div class="home">
    <router-link to="/classManage">班级管理</router-link>
		<router-link to="/studentManage">学生管理</router-link>
		<router-link to="/teacherManage">老师管理</router-link>
		<router-link to="/arrangeTest">安排考试</router-link>
		<router-link to="/correctTestPaper">试卷批阅</router-link>
		<router-link to="/maintainTestPaper">试卷维护</router-link>
		<router-link to="/makeTestPaper">试卷出题</router-link>
		<router-link to="/viewScore">查看成绩</router-link>
		<router-view/>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'home',
  components: {
 
  }
}
</script>
