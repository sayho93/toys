import express from 'express'
import Container from '#src/loaders/container'
import UserRoute from '#routes/api/v1/user.route'
// import LotteryRoute from '#routes/api/v1/lottery.route'
// import FileRoute from '#routes/api/v1/file.route'
// import PlannerRoute from '#routes/api/v1/planner.route'
// import ArticleRoute from '#routes/api/v1/article.route'
// import ChatRoute from '#routes/api/v1/chat.route'

const router = express.Router({mergeParams: true})

const UserController = Container.resolve('UserController')

const userRoute = UserRoute({UserController})

router.use('/user', userRoute.router)
// router.use('/lottery', lotteryRoute.router)
// router.use('/file', fileRoute.router)
// router.use('/planner', plannerRoute.router)
// router.use('/article', articleRoute.router)
// router.use('/chat', chatRoute.router)

// const v1Route = () => {
//
//     // const lotteryRoute = LotteryRoute(Controllers.lotteryController)
//     // const fileRoute = FileRoute(Controllers.fileController)
//     // const plannerRoute = PlannerRoute(Controllers.plannerController)
//     // const articleRoute = ArticleRoute(Controllers.articleController)
//     // const chatRoute = ChatRoute(Controllers.chatController)
//
//     router.use('/user', userRoute.router)
//     // router.use('/lottery', lotteryRoute.router)
//     // router.use('/file', fileRoute.router)
//     // router.use('/planner', plannerRoute.router)
//     // router.use('/article', articleRoute.router)
//     // router.use('/chat', chatRoute.router)
//
//     return {router}
// }

export default router
