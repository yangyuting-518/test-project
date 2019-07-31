import ClassManage from '../views/base/classManage.vue'
import StudentManage from '../views/base/studentManage.vue'
import TeacherManage from '../views/base/teacherManage.vue'

export default[
	{
		path:'classManage',
		component:ClassManage
	},
	{
		path:'studentManage',
		component:StudentManage
	},
	{
		path:'teacherManage',
		component:TeacherManage
	}
]