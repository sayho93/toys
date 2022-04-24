import express from 'express'
import UserRoute from '#routes/api/v1/user.route'
import LotteryRoute from '#routes/api/v1/lottery.route'
import FileRoute from '#routes/api/v1/file.route'
import PlannerRoute from '#routes/api/v1/planner.route'
import ArticleRoute from '#routes/api/v1/article.route'
import ChatRoute from '#routes/api/v1/chat.route'

const router = express.Router({mergeParams: true})

const v1Route = ({Controllers}) => {
    const userRoute = UserRoute(Controllers.userController)
    const lotteryRoute = LotteryRoute(Controllers.lotteryController)
    const fileRoute = FileRoute(Controllers.fileController)
    const plannerRoute = PlannerRoute(Controllers.plannerController)
    const articleRoute = ArticleRoute(Controllers.articleController)
    const chatRoute = ChatRoute(Controllers.chatController)

    router.use('/user', userRoute.router)
    router.use('/lottery', lotteryRoute.router)
    router.use('/file', fileRoute.router)
    router.use('/planner', plannerRoute.router)
    router.use('/article', articleRoute.router)
    router.use('/chat', chatRoute.router)

    return {router}
}

export default v1Route