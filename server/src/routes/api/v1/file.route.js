import express from 'express'
import {AsyncHandler} from '#src/loaders/middlewares'

const FileRoute = ({FileController, Multipart}) => {
    const router = express.Router({mergeParams: true})

    router.post('/upload/single', Multipart.single('img'), AsyncHandler(FileController.uploadSingleFile))

    router.delete('/remove/single', AsyncHandler(FileController.removeSingleFile))

    return {router}
}

export default FileRoute
