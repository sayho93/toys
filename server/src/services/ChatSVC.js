import Log from 'src/utils/Logger'
// import Models from 'src/models'
import {QueryTypes} from 'sequelize'
import PushManager from 'src/utils/PushManager'

const ChatSVC = {
    addChatRoom: async users => {
        let ids = []
        let title = ''
        for (let [i, item] of users.entries()) {
            let tmp = await Models.userModel.findByPk(item)
            ids.push(tmp.id)
            if (i !== 0) title = title + ', ' + tmp.nickname
            else title += tmp.nickname
        }
        const res = await Models.chatRoomModel.create({name: title})
        Log.info(res.id)
        ids.forEach(item => Models.chatMemberModel.create({userId: item, roomId: res.id}))
    },
    addChatMessage: async (userId, roomId, content, timestamp) => {
        Log.info(userId, roomId, content, timestamp)
        const res = await Models.chatMessageModel.create({
            userId: userId,
            roomId: roomId,
            content: content,
            timestamp: timestamp,
        })
        Log.info(res.id)

        const query = `
                SELECT M.*, U.nickname
                FROM tblChatMessage M
                         JOIN tblUser U ON M.userId = U.id
                WHERE M.id = :messageId
            `
        const item = await Models.sequelize.query(query, {
            replacements: {messageId: res.id},
            type: QueryTypes.SELECT,
        })
        return item[0]
    },
    chatMessageList: async roomId => {
        let query = `
            SELECT *
            FROM tblChatMessage M
                     JOIN tblUser U on M.userId = U.id
            WHERE roomId = :id
        `
        return await Models.sequelize.query(query, {
            replacements: {id: roomId},
            type: QueryTypes.SELECT,
        })
    },
    chatMemberList: async roomId => {
        return await Models.sequelize.query(
            `
            SELECT *
            FROM tblChatMember CM
                     JOIN tblUser U ON CM.userId = U.id
            WHERE roomId = :roomId
        `,
            {
                replacements: {roomId: roomId},
                type: QueryTypes.SELECT,
            }
        )
    },
    chatList: async userId => {
        let query = `
            SELECT *
            FROM app_midnight.tblUser
            WHERE id IN (
                select userId
                FROM app_midnight.tblChatMember
                WHERE roomId IN (SELECT roomId
                                 FROM app_midnight.tblChatRoom R
                                          JOIN app_midnight.tblChatMember M ON R.id = M.roomId
                                 WHERE M.userid = :id)
                  AND userId != :id
                )
        `
        return await Models.sequelize.query(query, {
            replacements: {id: userId},
            type: QueryTypes.SELECT,
        })
    },
    sendChatPush: (senderId, receiverId, message, data = '') => {
        return new Promise((resolve, reject) => {
            Promise.all([Models.userModel.findByPk(senderId), Models.userModel.findByPk(receiverId)])
                .then(async res => {
                    if (res[1].push === 1) await PushManager.send(new Array(res[1].pushToken), res[0].nickname, message)
                    resolve()
                })
                .catch(err => reject(err))
        })
    },
}

export default ChatSVC
