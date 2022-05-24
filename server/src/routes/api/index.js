import express from 'express'
import Config from '#configs/config'
import UserRoute from '#routes/api/v1/user.route'
import LotteryRoute from '#routes/api/v1/lottery.route'
import FileRoute from '#routes/api/v1/file.route'
import PlannerRoute from '#routes/api/v1/planner.route'
import ArticleRoute from '#routes/api/v1/article.route'
import ChatRoute from '#routes/api/v1/chat.route'

const router = express.Router()

router.get('/', (req, res) => {
    res.json(`${Config.app.SERVICE_NAME} API Server running..`)
})

const v1Router = express.Router({mergeParams: true})
v1Router.use('/user', UserRoute())
v1Router.use('/lottery', LotteryRoute())
v1Router.use('/file', FileRoute())
v1Router.use('/planner', PlannerRoute())
v1Router.use('/article', ArticleRoute())
v1Router.use('/chat', ChatRoute())

router.use('/v1', v1Router)

export default router
