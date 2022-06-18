import express from 'express'
import apiRoute from '#routes/api/index'
import linkRoute from '#routes/link.route'

const router = express.Router()

router.use('/api', apiRoute)
router.use('/link', linkRoute)

export default router
