import express from 'express'
import Config from '#configs/config'
import v1Router from '#routes/api/v1/index'

const router = express.Router()

router.get('/', (req, res) => {
    res.json(`${Config.app.SERVICE_NAME} Server running..`)
})

router.use('/v1', v1Router)

export default router
