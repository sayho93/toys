import express from 'express'
import Container from '#src/loaders/container'
import {body} from 'express-validator'
import {AsyncHandler} from '#src/loaders/middlewares'

const router = express.Router()
const LinkController = Container.get('LinkController')

router.post(
    '/',
    body('url').notEmpty().withMessage('Url is required'),
    body('url')
        .isURL({protocols: ['https', 'http'], require_protocol: true})
        .withMessage('Url does not seem to be valid'),
    AsyncHandler(LinkController.generateShortLink)
)
router.get('/:shortId', AsyncHandler(LinkController.redirectShortLink))
router.get('/info/:shortId', AsyncHandler(LinkController.redirectShortLink))

export default router
