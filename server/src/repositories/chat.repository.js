import Log from '#utils/logger'

const ChatRepository = ({Models}) => {
    const chatRooms = async () => {
        return await Models.room.aggregate().addFields({
            createdAt: {$dateToString: {date: '$createdAt', timezone: '+0900', format: '%Y-%m-%d %H:%M:%S'}},
            updatedAt: {$dateToString: {date: '$updatedAt', timezone: '+0900', format: '%Y-%m-%d %H:%M:%S'}},
        })
    }

    const chatRoom = async id => {
        return await Models.room.aggregate([
            {$lookup: {from: 'messages', localField: '_id', foreignField: 'roomId', as: 'messages'}},
            {$match: {_id: Models.types.ObjectId(id)}},
            {
                $addFields: {
                    messages: {
                        $map: {
                            input: '$messages',
                            in: {
                                $mergeObjects: [
                                    '$$this',
                                    {
                                        createdAt: {$dateToString: {date: '$$this.createdAt', timezone: '+0900', format: '%Y-%m-%d %H:%M:%S'}},
                                        updatedAt: {$dateToString: {date: '$$this.updatedAt', timezone: '+0900', format: '%Y-%m-%d %H:%M:%S'}},
                                    },
                                ],
                            },
                        },
                    },
                    createdAt: {$dateToString: {date: '$createdAt', timezone: '+0900', format: '%Y-%m-%d %H:%M:%S'}},
                    updatedAt: {$dateToString: {date: '$updatedAt', timezone: '+0900', format: '%Y-%m-%d %H:%M:%S'}},
                },
            },
            {$sort: {'messages._id': 1}},
            {$limit: 10},
        ])
    }

    const saveRoom = async (title, membersObj) => {
        const room = Models.room({
            title: !title ? membersObj.map(i => i.name).join(', ') : title,
            members: membersObj,
        })
        await room.save()
        return room
    }

    const findRoomById = async id => {
        return await Models.room.find({_id: Models.types.ObjectId(id)})
    }

    const saveMessage = async (roomId, user, content) => {
        const message = Models.message({
            roomId: Models.types.ObjectId(roomId),
            user: {
                id: user[0].id,
                email: user[0].email,
                name: user[0].name,
            },
            content: content,
        })
        await message.save()
        Log.debug(JSON.stringify(message))
        return message
    }

    return {
        chatRooms,
        chatRoom,
        saveRoom,
        findRoomById,
        saveMessage,
    }
}

export default ChatRepository
