import express from 'express'
import {AsyncHandler} from '#src/loaders/middlewares'
import Container from '#src/loaders/container'
import FileUtil from '#utils/file.util'

const FileRoute = () => {
    const FileController = Container.fileController
    const router = express.Router({mergeParams: true})

    router.post('/single', FileUtil.Multipart.single('img'), AsyncHandler(FileController.uploadSingleFile))

    router.delete('/single', AsyncHandler(FileController.removeSingleFile))

    router.get('/single/:id', AsyncHandler(FileController.downloadSingleFile))

    return router
}

export default FileRoute()
