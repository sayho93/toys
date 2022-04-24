import express from 'express'
import V1Route from '#routes/api/v1/v1.route'
import Config from '#configs/config'

const router = express.Router()

const ApiRoute = ({Controllers}) => {
    const v1Route = V1Route({Controllers})

    router.get('/', (req, res) => {
        res.json(`${Config.app.SERVICE_NAME} Server running..`)
    })

    router.use('/v1', v1Route.router)

    return {router}
}

export default ApiRoute
