import {validationErrorHandler} from '#utils/common.util'

const ChatController = ChatService => {
    const rooms = async (req, res) => {
        const ret = await ChatService.getChatRooms()
        res.json(ret)
    }

    const room = async (req, res) => {
        validationErrorHandler(req)
        const id = req.params.id
        const ret = await ChatService.getChatRoom(id)
        res.json(ret)
    }

    const addRoom = async (req, res) => {
        const params = req.body
        const ret = await ChatService.addChatRoom(params)
        res.json(ret)
    }

    const addMessage = async (req, res) => {
        const params = req.body
        const ret = await ChatService.addChatMessage({roomId: req.params.id, ...params})
        res.json(ret)
    }

    return {
        rooms,
        room,
        addRoom,
        addMessage,
    }
}

export default ChatController
