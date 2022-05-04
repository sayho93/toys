import express from 'express'
import {AsyncHandler} from '#src/loaders/middlewares'

const FileRoute = ({FileController, FileUtil}) => {
    const router = express.Router({mergeParams: true})

    router.post('/upload/single', FileUtil.Multipart.single('img'), AsyncHandler(FileController.uploadSingleFile))

    router.delete('/remove/single', AsyncHandler(FileController.removeSingleFile))

    router.get('/download/single/:id', AsyncHandler(FileController.downloadSingleFile))

    return {router}
}

export default FileRoute
