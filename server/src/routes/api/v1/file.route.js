import express from 'express'
import {AsyncHandler} from '#utils/common.util'
import {Multipart} from '#utils/file.util'

const router = express.Router({mergeParams: true})

const FileRoute = FileController => {
    router.post('/upload/single', Multipart.single('img'), AsyncHandler(FileController.uploadSingleFile))

    router.delete('/remove/single', AsyncHandler(FileController.removeSingleFile))

    return {router}
}

export default FileRoute
