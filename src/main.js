import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


//配置基础url前缀
axios.defaults.baseURL = 'http://192.168.1.188:12/api';

// http request 请求拦截器
axios.interceptors.request.use(config => {
	// 在发送请求之前做些什么
  let pathname = location.pathname;
	if(sessionStorage.getItem('token')){
		if(pathname != '/' &&  pathname != '/login'){
      // config.headers.common[''Authorization'] = sessionStorage.getItem('token');
      config.headers.Authorization = sessionStorage.getItem('token')
		}
  }
  // console.log(config)
	return config;
}, error => {
	// 对请求错误做些什么
	return Promise.reject(error);
});

//  http response 响应拦截器
axios.interceptors.response.use(response => {
  return response;
},error => {
  if (error.response) {
   switch (error.response.status) {
     // 返回401，清除token信息并跳转到登录页面
     case 401:
      sessionStorage.removeItem('token');
      router.replace({
        path: '/',
        //登录成功后跳入浏览的当前页面
        query: {redirect: router.currentRoute.fullPath}
      });
   }
   // 返回接口返回的错误信息
   return Promise.reject(error.response.data);
 }
});

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueAxios, axios)

// router.beforeEach((to,from,next)=>{
  // console.log(to)
  // let token= sessionStorage.getItem("token");
  // if(token){
  //   next()
  // }else if(to.path!=="/"){//当将要进入的目标路径不是登录，就跳转到登录页面
  //   next({path: '/',query: {redirect: to.fullPath}});//不要在next里面加"path:/",会陷入死循环
  //   //将跳转的路由path作为参数，登录成功后跳转到该路由
  // }else{//如果是登录页面，就继续访问
  //   next()
  // };

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

