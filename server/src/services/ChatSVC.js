class ChatSVC {
    constructor({Config, Mappers, Models, Utils, Log, MailSender, PushManager, FileUtil}) {
        this.Config = Config
        this.Mappers = Mappers
        this.Models = Models
        this.Utils = Utils
        this.Log = Log
        this.MailSender = MailSender
        this.PushManager = PushManager
        this.FileUtil = FileUtil
    }

    async getChatRooms() {
        return await this.Models.room.aggregate().addFields({
            createdAt: {$dateToString: {date: '$createdAt', timezone: '+0900', format: '%Y-%m-%d %H:%M:%S'}},
            updatedAt: {$dateToString: {date: '$updatedAt', timezone: '+0900', format: '%Y-%m-%d %H:%M:%S'}},
        })
    }

    async getChatRoom(id) {
        return await this.Models.room.aggregate([
            {$lookup: {from: 'messages', localField: '_id', foreignField: 'roomId', as: 'messages'}},
            {$match: {_id: this.Models.types.ObjectId(id)}},
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

    async addChatRoom({title = null, members}) {
        let memberList = members.split(',').map(Number)
        const membersObj = []

        const promises = memberList.map(async id => {
            const user = await this.Mappers.userMapper.getUserById(id)
            if (user.length) membersObj.push({id, email: user[0].email, name: user[0].name})
        })
        await Promise.allSettled(promises)

        const room = this.Models.room({
            title: !title ? membersObj.map(i => i.name).join(', ') : title,
            members: membersObj,
        })
        await room.save()
        return room
    }

    async addChatMessage({roomId, userId, content}) {
        const err = new Error()
        err.status = 400
        const user = await this.Mappers.userMapper.getUserById(userId)
        if (!user.length) {
            err.message = '유저가 존재하지 않습니다.'
            throw err
        }
        const room = await this.Models.room.find({_id: this.Models.types.ObjectId(roomId)})
        if (!room.length) {
            err.message = '존재하지 않는 방입니다.'
            throw err
        }

        const members = room[0].members.filter(i => i.id === +userId)
        if (!members.length) {
            err.message = '채팅방에 참여하지 않은 사용자입니다.'
            throw err
        }

        const message = this.Models.message({
            roomId: this.Models.types.ObjectId(roomId),
            user: {
                id: user[0].id,
                email: user[0].email,
                name: user[0].name,
            },
            content: content,
        })
        await message.save()
        this.Log.debug(JSON.stringify(message))
        return message
    }

    // ###################### TODO

    async sendChatPush(senderId, receiverId, message, data = '') {
        return new Promise((resolve, reject) => {
            Promise.all([Models.userModel.findByPk(senderId), Models.userModel.findByPk(receiverId)])
                .then(async res => {
                    if (res[1].push === 1) await PushManager.send(new Array(res[1].pushToken), res[0].nickname, message)
                    resolve()
                })
                .catch(err => reject(err))
        })
    }
}

export default ChatSVC
