import express from 'express'
import {body, param} from 'express-validator'
import {AsyncHandler} from '#utils/common.util'

const router = express.Router({mergeParams: true})

const ChatRoute = ChatController => {
    router.get('/rooms', AsyncHandler(ChatController.rooms))

    router.get('/room/:id', param('id').isMongoId().withMessage('invalid request parameter'), AsyncHandler(ChatController.room))

    router.post('/room/add', AsyncHandler(ChatController.addRoom))

    router.post(
        '/message/add/:id',
        body('content').notEmpty().withMessage('Content is required'),
        body('userId').notEmpty().withMessage('User id is required'),
        AsyncHandler(ChatController.addMessage)
    )

    return {router}
}

export default ChatRoute
