import ClassManage from '../views/base/ClassManage.vue'
import StudentManage from '../views/base/StudentManage.vue'
import TeacherManage from '../views/base/TeacherManage.vue'
import ModifyPassWord from '../views/base/ModifyPassWord.vue'
import RoleManage from '../views/base/RoleManage.vue'

export default[
	{
		path:'/ClassManage',
		component:ClassManage,
	},
	{
		path:'/StudentManage',
		component:StudentManage
	},
	{
		path:'/TeacherManage',
		component:TeacherManage
	},
	{
		path:'/ModifyPassWord',
		component:ModifyPassWord
	},
	{
		path:'/RoleManage',
		component:RoleManage
	}
]