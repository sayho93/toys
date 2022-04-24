const ChatService = ({Repositories}) => {
    const getChatRooms = async () => {
        return await Repositories.chatRepository.chatRooms()
    }

    const getChatRoom = async id => {
        return await Repositories.chatRepository.chatRoom(id)
    }

    const addChatRoom = async ({title = null, members}) => {
        let memberList = members.split(',').map(Number)
        const membersObj = []

        const promises = memberList.map(async id => {
            const user = await Repositories.userRepository.getUserById(id)
            if (user.length) membersObj.push({id, email: user[0].email, name: user[0].name})
        })
        await Promise.allSettled(promises)

        return await Repositories.chatRepository.saveRoom(title, membersObj)
    }

    const addChatMessage = async ({roomId, userId, content}) => {
        const err = new Error()
        err.status = 400
        const user = await Repositories.userRepository.getUserById(userId)
        if (!user.length) {
            err.message = '유저가 존재하지 않습니다.'
            throw err
        }
        const room = await Repositories.chatRepository.findRoomById(roomId)
        if (!room.length) {
            err.message = '존재하지 않는 방입니다.'
            throw err
        }

        const members = room[0].members.filter(i => i.id === +userId)
        if (!members.length) {
            err.message = '채팅방에 참여하지 않은 사용자입니다.'
            throw err
        }

        return await Repositories.chatRepository.saveMessage(roomId, user, content)
    }

    // ###################### TODO

    // const sendChatPush = async (senderId, receiverId, message, data = '') => {
    //     return new Promise((resolve, reject) => {
    //         Promise.all([Models.userModel.findByPk(senderId), Models.userModel.findByPk(receiverId)])
    //             .then(async res => {
    //                 if (res[1].push === 1) await PushManager.send(new Array(res[1].pushToken), res[0].nickname, message)
    //                 resolve()
    //             })
    //             .catch(err => reject(err))
    //     })
    // }

    return {
        getChatRooms,
        getChatRoom,
        addChatRoom,
        addChatMessage,
    }
}

export default ChatService
