import express from 'express'
import {AsyncHandler} from '#src/loaders/middlewares'
import Container from '#src/loaders/container'

const ArticleRoute = () => {
    const ArticleController = Container.get('ArticleController')
    const router = express.Router({mergeParams: true})

    router.get('/list', AsyncHandler(ArticleController.list))

    router.get('/:id', AsyncHandler(ArticleController.getById))

    router.post('/save', AsyncHandler(ArticleController.save))

    router.post('/comment/save', AsyncHandler(ArticleController.saveComment))

    return router
}

export default ArticleRoute
