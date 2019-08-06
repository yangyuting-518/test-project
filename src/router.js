import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Base from './router/base.js'
import OnlineTest from './router/test.js'
import Login from './views/Login.vue'

Vue.use(Router)

const vueRouter =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,//与项目的基路径保持一致，可以在vue.config.js中修改
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
			children:[
				...Base,
				...OnlineTest
			]
    },
    {
      path: '/',
      name: 'login',
      component:Login
    }
  ]
})

vueRouter.beforeEach((to,from,next)=>{
  console.log(to)
  let token= sessionStorage.getItem("token");
  if(token){
    next()
  }else if(to.path!=="/"){//当将要进入的目标路径不是登录，就跳转到登录页面
    next({path: '/',query: {redirect: to.fullPath}});//不要在next里面加"path:/",会陷入死循环
    //将跳转的路由path作为参数，登录成功后跳转到该路由
  }else{//如果是登录页面，就继续访问
    next()
  }
});
export default vueRouter;