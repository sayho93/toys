import express from 'express'
import {body} from 'express-validator'
import {AsyncHandler} from '#src/loaders/middlewares'

import Container from '#loaders/container'

const router = express.Router()
const LinkController = Container.linkController

router.post(
    '/',
    body('url').notEmpty().withMessage('Url is required'),
    body('url')
        .isURL({protocols: ['https', 'http'], require_protocol: true})
        .withMessage('Url does not seem to be valid'),
    AsyncHandler(LinkController.generateShortLink)
)
router.get('/:shortId', AsyncHandler(LinkController.redirectShortLink))
router.get('/info/:shortId', AsyncHandler(LinkController.getShortLink))

export default router
