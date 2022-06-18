import {Request, Response} from 'express'
import {Controllers} from '#types/controllers'
import {Utils} from '#types/utils'
import Log = Utils.Log
import ErrorHandler = Utils.ErrorHandler
import PhotoService = Services.PhotoService
import PhotoController = Controllers.PhotoController

export const makePhotoController = (service: PhotoService, ErrorHandler: ErrorHandler, Log: Log): PhotoController => {
    return {
        async addPhoto(req: Request, res: Response) {
            const userId = req.body.userId
            const fileId = req.body.fileId
            const ocrText = req.body.ocrText

            const ret = await service.addPhoto(userId, fileId, ocrText)
            res.json(ret)
        },

        async getPhotos(req: Request, res: Response) {
            ErrorHandler.validationErrorHandler(req)
            const photos = await service.getPhotos({
                userId: req.query.userId ? +req.query.userId : 0,
                searchTxt: (req.query.searchTxt as string) ?? '',
                page: parseInt(req.query.page as string) ?? 1,
                limit: parseInt(req.query.limit as string) ?? 10,
            })
            res.json(photos)
        },

        async getPhoto(req: Request, res: Response) {
            const id = +req.params.id
            const photo = await service.getPhoto(id)
            if (!photo) {
                res.status(404).send('Photo not found')
                return
            }
            res.json(photo)
        },
        async removePhoto(req: Request, res: Response): Promise<void> {
            const id = +req.params.id
            const ret = await service.removePhoto(id)
            if (ret) {
                res.json(ret)
                return
            }
            res.status(404).send('Photo not found')
        },
    }
}
