import ArrangeTest from '../views/onlineTest/arrangeTest.vue'
import CorrectTestPaper from '../views/onlineTest/correctTestPaper.vue'
import MaintainTestPaper from '../views/onlineTest/maintainTestPaper.vue'
import MakeTestPaper from '../views/onlineTest/makeTestPaper.vue'
import ViewScore from '../views/onlineTest/viewScore.vue'

export default[
	{
		path:'/arrangeTest',
		component:ArrangeTest
	},
	{
		path:'/correctTestPaper',
		component:CorrectTestPaper
	},
	{
		path:'/maintainTestPaper',
		component:MaintainTestPaper
	},
	{
		path:'/makeTestPaper',
		component:MakeTestPaper
	},
	{
		path:'/viewScore',
		component:ViewScore
	},
]