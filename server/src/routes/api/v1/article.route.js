import express from 'express'
import {AsyncHandler} from '#utils/common.util'

const router = express.Router({mergeParams: true})

const ArticleRoute = ArticleController => {
    router.get('/list', AsyncHandler(ArticleController.list))

    router.get('/:id', AsyncHandler(ArticleController.getById))

    router.post('/save', AsyncHandler(ArticleController.save))

    router.post('/comment/save', AsyncHandler(ArticleController.saveComment))

    return {router}
}

export default ArticleRoute
