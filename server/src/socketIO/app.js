import chatSVC from '#src/services/chat.service'
import Log from '#utils/logger'
import {Server} from 'socket.io'

const SocketIO = server => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Access-Control-Request-Headers', 'Access-Control-Request-Method'],
            credentials: true,
        },
        transports: ['websocket'],
        path: '/toysChat',
    })

    io.use((socket, next) => {
        const err = new Error('not authorized')
        err.data = {content: 'please retry later'}
        next(err)
    })
    ioEvents(io)
    Log.verbose('Socket.io server started consuming')
    return server
}

const ioEvents = io => {
    const clients = new Map()

    const ChatRoom = io
        .of('/chatRoom', name => {
            // Log.info(JSON.stringify(name.handshake.query))
            const roomId = name.handshake.query.roomId
            const userName = name.handshake.query.userName
            ChatRoom.to(roomId).emit('joinRoom', roomId, userName)
        })
        .on('connection', socket => {
            Log.info('user connected')
            socket.on('joinRoom', user => {
                user = JSON.parse(user)
                Log.debug(user)
                Log.info(user.vendor)
                Log.info(user.sender)
                clients.forEach(item => {
                    Log.info(JSON.stringify(item))
                })
                Log.debug('::joinRoom start')
                Log.debug(`socket id: ${socket.id}`)
                clients.set(socket.id, {roomId: user.vendor, userId: user.sender})
                clients.forEach(item => {
                    Log.info(JSON.stringify(item))
                })
                Log.info(user.sender + ' joined room ' + user.vendor + ':::::')
                socket.join(user.vendor)
                Log.info(user.sender + ' joined room ' + user.vendor)
                ChatRoom.to(user.vendor).emit('joinRoom', user.vendor, user.sender)
            })

            socket.on('chatMsg', async message => {
                Log.info(`chatMsg: ${message}`)
                message = JSON.parse(message)
                // Log.info('chatMsg: ' + name + ", " + msg)
                const item = await chatSVC.addChatMessage(message.sender, message.vendor, message.msg, message.timestamp)
                Log.info(`chatRet${JSON.stringify(item)}`)
                await ChatRoom.to(message.vendor).emit('chatMsg', item)
                await chatSVC.sendChatPush(message.sender, message.receiver, message.msg)
            })

            socket.on('leaveRoom', (roomId, name) => {
                Log.info(name + ' left room ' + roomId + ':::::')
                socket.leave(roomId)
                Log.info(name + ' left room ' + roomId)
                clients.forEach(item => {
                    Log.info(JSON.stringify(item))
                })
                Log.debug(':: leveRoom start')
                clients.delete(socket.id)
                clients.forEach(item => {
                    Log.info(JSON.stringify(item))
                })
                ChatRoom.to(roomId).emit('leaveRoom', roomId, name)
            })

            socket.on('disconnect', () => {
                Log.info('user disconnected')
                Log.debug(socket.id)
                clients.forEach(item => {
                    Log.info(JSON.stringify(item))
                })
                Log.debug(':::: disconnect')
                const user = clients.get(socket.id)
                if (user) ChatRoom.to(user.roomId).emit('leaveRoom', user.roomId, user.name)
                clients.delete(socket.id)
                clients.forEach(item => {
                    Log.info(JSON.stringify(item))
                })
                Log.debug(':::: removed')
            })
        })
}

export default SocketIO
