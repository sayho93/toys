import express from 'express'
import Container from '#src/loaders/container'

const router = express.Router({mergeParams: true})

router.use('/user', Container.get('UserRoute').router)
router.use('/lottery', Container.get('LotteryRoute').router)
router.use('/file', Container.get('FileRoute').router)
router.use('/planner', Container.get('PlannerRoute').router)
router.use('/article', Container.get('ArticleRoute').router)
router.use('/chat', Container.get('ChatRoute').router)

export default router
