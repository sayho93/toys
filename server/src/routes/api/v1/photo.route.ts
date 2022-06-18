import express from 'express'
import {AsyncHandler} from '#src/loaders/middlewares'
import Container from '#src/loaders/container'
import {query} from 'express-validator'

const PhotoRoute = () => {
    const PhotoController = Container.photoController
    const router = express.Router({mergeParams: true})

    router.post('/', query('userId').notEmpty().withMessage('User id is required'), AsyncHandler(PhotoController.addPhoto))

    router.get('/', AsyncHandler(PhotoController.getPhotos))
    router.get('/:id', AsyncHandler(PhotoController.getPhoto))

    router.delete('/:id', AsyncHandler(PhotoController.removePhoto))

    return router
}

export default PhotoRoute()
