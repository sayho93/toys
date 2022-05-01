import express from 'express'
import {AsyncHandler} from '#src/loaders/middlewares'

const ArticleRoute = ({ArticleController}) => {
    const router = express.Router({mergeParams: true})

    router.get('/list', AsyncHandler(ArticleController.list))

    router.get('/:id', AsyncHandler(ArticleController.getById))

    router.post('/save', AsyncHandler(ArticleController.save))

    router.post('/comment/save', AsyncHandler(ArticleController.saveComment))

    return {router}
}

export default ArticleRoute
