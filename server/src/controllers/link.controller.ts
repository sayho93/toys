import {Request, Response} from 'express'
import {Controllers} from '#types/controllers'
import {Utils} from '#types/utils'
import LinkController = Controllers.LinkController
import ErrorHandler = Utils.ErrorHandler
import LinkService = Services.LinkService

export const makeLinkController = (service: LinkService, ErrorHandler: ErrorHandler): LinkController => {
    const generateShortLink = async (req: Request, res: Response) => {
        ErrorHandler.validationErrorHandler(req)
        res.json(await service.generateShortLink(req.body.url))
    }

    const getShortLink = async (req: Request, res: Response) => {
        const ret: DTO.LinkDTO = await service.getShortLink(req.params.shortId)
        if (!ret) {
            throw ErrorHandler.BaseError('Short link not found', 404)
        }
        delete ret.id
        res.json({data: ret})
    }

    const redirectShortLink = async (req: Request, res: Response) => {
        const ret = await service.getShortLink(req.params.shortId)
        if (!ret) {
            throw ErrorHandler.BaseError('Short link not found', 404)
        }
        res.redirect(ret.url)
    }

    return {
        generateShortLink,
        getShortLink,
        redirectShortLink,
    }
}
