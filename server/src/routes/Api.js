import express from 'express'
import {body, validationResult} from 'express-validator'

import Response from 'src/utils/Response'
import ResponseConst from 'src/utils/ResponseConst'

/* Dependency imports */
import Config from 'src/config/Config'
import Utils from 'src/utils/Utils'
import MailSender from 'src/utils/MailSender'
import PushManager from 'src/utils/PushManager'
import Log from 'src/utils/Logger'
import {FileUtil, Multipart} from 'src/utils/FileUtil'

/* Service imports */
import UserSVC from 'src/services/UserSVC'
import LotterySVC from 'src/services/LotterySVC'
import PlannerSVC from 'src/services/PlannerSVC'
import ArticleSVC from 'src/services/ArticleSVC'
//TODO implement
import ChatSVC from 'src/services/ChatSVC'
import FileSVC from 'src/services/FileSVC'
import schedule from 'node-schedule'
import dotenv from 'dotenv'

const router = express.Router()

dotenv.config()
const Api = ({Mappers, Models, AsyncHandler}) => {
    const dependency = {Config, Mappers, Models, Utils, Log, MailSender, PushManager, FileUtil}

    const userSVC = new UserSVC(dependency)
    const lotterySVC = new LotterySVC(dependency)
    const plannerSVC = new PlannerSVC(dependency)
    const articleSVC = new ArticleSVC(dependency)
    const chatSVC = new ChatSVC(dependency)
    const fileSVC = new FileSVC(dependency)

    if (process.env.NODE_ENV === 'production' && process.env.INSTANCE_ID === '0001') {
        const rule = new schedule.RecurrenceRule()
        rule.second = 0
        rule.minute = 0
        schedule.scheduleJob(rule, async () => {
            await lotterySVC.batchProcess()
        })

        const notifyRule = new schedule.RecurrenceRule()
        notifyRule.second = 0
        notifyRule.minute = 50
        notifyRule.hour = 20
        notifyRule.dayOfWeek = 6
        schedule.scheduleJob(notifyRule, async () => {
            await lotterySVC.notify()
        })
    }

    router.get('/', (req, res) => {
        res.json(`${Config.app.SERVICE_NAME} Server running..`)
    })

    router.get(
        '/batchTest',
        AsyncHandler(async (req, res) => {
            await lotterySVC.batchProcess()
            res.json('done')
        })
    )

    router.post(
        '/signup',
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
        body('name').notEmpty().withMessage('Name is required'),
        AsyncHandler(async (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const err = new Error(errors.array()[0].msg)
                err.status = 400
                throw err
            }
            const user = await userSVC.signup(req.body)
            console.log(user)
            if (user) delete user.password
            res.json(user)
        })
    )

    router.get(
        '/auth/:userId',
        AsyncHandler(async (req, res) => {
            const userId = req.params.userId
            const token = req.query.token
            if (token) {
                const check = await userSVC.auth(userId, token)
                if (check) res.send(`<script>alert('Success');self.close()</script>`)
                else res.status(401).send(`<script>alert('Unauthorized');self.close()</script>`)
            } else {
                const err = new Error('Invalid token')
                err.status = 400
                throw err
            }
        })
    )

    router.post(
        '/login',
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
        AsyncHandler(async (req, res) => {
            let err
            const errors = validationResult(req)
            if (!errors.isEmpty()) err = new Error(errors.array()[0].msg)

            const user = await userSVC.login(req.body)

            if (!user) err = new Error('이메일이나 비밀번호가 잘못되었습니다.')
            else if (user.status === 0) err = new Error('이메일 인증 후 로그인 해주세요.')

            if (err) {
                err.status = 400
                throw err
            }
            res.json(user)
        })
    )

    router.get(
        '/user/:id',
        AsyncHandler(async (req, res) => {
            let id = req.params.id
            const user = await userSVC.getUserById(id)
            if (user) delete user.password
            res.json(user)
        })
    )

    router.post(
        '/user/updateToken',
        body('userId').notEmpty().withMessage('UserId is required'),
        AsyncHandler(async (req, res) => {
            const userId = req.body.userId
            const token = req.body.token
            const result = await userSVC.updateToken(userId, token)
            Log.debug(result)
            res.json(result)
        })
    )

    router.post(
        '/lottery/save/:userId',
        body('roundNo').notEmpty().withMessage('Round number is required'),
        body('numList').notEmpty().withMessage('List of numbers is required'),
        AsyncHandler(async (req, res) => {
            const errors = validationResult(req)
            console.log(errors.array())
            if (!errors.isEmpty()) {
                const err = new Error(errors.array()[0].msg)
                err.status = 400
                throw err
            }
            const userId = req.params.userId
            const params = req.body
            const ret = await lotterySVC.saveLottery(userId, params)
            res.json(ret)
        })
    )

    router.get(
        '/lottery/list',
        AsyncHandler(async (req, res) => {
            const userId = req.query.userId
            const searchTxt = req.query.searchTxt
            const page = req.query.page
            const limit = req.query.limit
            const ret = await lotterySVC.getLotteryList(userId, searchTxt, page, limit)
            res.json(ret)
        })
    )

    router.get(
        '/lottery/fame',
        AsyncHandler(async (req, res) => {
            const searchTxt = req.query.searchTxt
            const page = req.query.page
            const limit = req.query.limit
            const ret = await lotterySVC.getFameList(searchTxt, page, limit)
            res.json(ret)
        })
    )

    router.get(
        '/lottery/last',
        AsyncHandler(async (req, res) => {
            const week = Utils.getWeek()
            const ret = await userSVC.getTest(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${week}`)
            res.json(ret)
        })
    )

    router.get(
        '/test/push',
        AsyncHandler(async (req, res) => {
            const message = req.query.message
            await userSVC.sendPushToAll(message)
            res.json(true)
        })
    )

    router.get(
        '/test/mail',
        AsyncHandler(async (req, res) => {
            await userSVC.sendMail()
            res.json(true)
        })
    )

    router.get(
        '/planner/list',
        AsyncHandler(async (req, res) => {
            const ret = await plannerSVC.getPlannerList()
            res.json(ret)
        })
    )

    router.post(
        '/planner/save',
        body('userId').notEmpty().withMessage('UserId is required'),
        body('title').notEmpty().withMessage('Title is required'),
        body('targetDate').notEmpty().withMessage('Target date is required'),
        body('color').notEmpty().withMessage('Color is required'),
        AsyncHandler(async (req, res) => {
            const errors = validationResult(req)
            console.log(errors.array())
            if (!errors.isEmpty()) {
                const err = new Error(errors.array()[0].msg)
                err.status = 400
                throw err
            }
            const params = req.body
            const ret = await plannerSVC.savePlanner(params)
            res.json(ret)
        })
    )

    router.get(
        '/planner/delete/:id',
        AsyncHandler(async (req, res) => {
            const id = req.params.id
            const ret = await plannerSVC.deletePlanner(id)
            res.json(ret)
        })
    )

    router.get(
        '/planner/latest',
        AsyncHandler(async (req, res) => {
            const ret = await plannerSVC.getLatest()
            res.json(ret)
        })
    )

    router.get(
        '/user/setNotified/:id',
        AsyncHandler(async (req, res) => {
            const id = req.params.id
            const ret = await userSVC.setUserNotified(id)
            res.json(ret)
        })
    )

    router.post(
        '/file/upload/single',
        Multipart.single('img'),
        AsyncHandler(async (req, res) => {
            let userId = req.body.userId
            let desc = req.body.desc
            let file = req.file
            console.log(file)
            if (file === undefined) {
                const err = new Error('file is required')
                err.status = 400
                throw err
            }
            const ret = await fileSVC.processFile(userId, file, desc)
            res.header('Access-Control-Allow-Origin', '*')
            res.json(ret)
        })
    )

    router.delete(
        '/file/remove/single',
        AsyncHandler(async (req, res) => {
            const id = +req.body
            const ret = await fileSVC.removeFile(id)
            res.header('Access-Control-Allow-Origin', '*')
            res.json(ret)
        })
    )

    router.get(
        '/article/list',
        AsyncHandler(async (req, res) => {
            const ret = await articleSVC.getArticleList(req.query)
            res.json(ret)
        })
    )

    router.get(
        '/article/:id',
        AsyncHandler(async (req, res) => {
            const id = req.params.id
            const ret = await articleSVC.getArticle({id})
            res.json(ret)
        })
    )

    router.post(
        '/article/save',
        AsyncHandler(async (req, res) => {
            const params = req.body
            const ret = await articleSVC.saveArticle(params)
            res.json(ret)
        })
    )

    router.post(
        '/article/comment/save',
        AsyncHandler(async (req, res) => {
            const params = req.body
            const ret = await articleSVC.saveComment(params)
            res.json(ret)
        })
    )

    router.get(
        '/chat/room/list',
        AsyncHandler(async (req, res) => {
            const ret = await chatSVC.getChatRooms()
            res.json(ret)
        })
    )

    router.get(
        '/chat/room/:id',
        AsyncHandler(async (req, res) => {
            const id = req.params.id
            const ret = await chatSVC.getChatRoom(id)
            res.json(ret)
        })
    )

    router.post(
        '/chat/room/add',
        AsyncHandler(async (req, res) => {
            const params = req.body
            const ret = await chatSVC.addChatRoom(params)
            res.json(ret)
        })
    )

    router.post(
        '/chat/message/add/:id',
        body('content').notEmpty().withMessage('Content is required'),
        body('userId').notEmpty().withMessage('User id is required'),
        AsyncHandler(async (req, res) => {
            const params = req.body
            const ret = await chatSVC.addChatMessage({roomId: req.params.id, ...params})
            res.json(ret)
        })
    )

    router.get(
        '/test/mongo/add/message',
        AsyncHandler(async (req, res) => {
            const message = new Models.message({
                roomId: Models.types.ObjectId('624af6c8d8d955eadc612f83'),
                user: {
                    id: 192,
                    email: 'test@test.com',
                    name: 'tester',
                },
                content: '?????????????????????????',
            })
            await message.save()
            Log.info('save success')
            Log.info(JSON.stringify(message))

            res.json(message)
        })
    )

    router.get(
        '/test/mongo/add/room',
        AsyncHandler(async (req, res) => {
            const room = new Models.room({
                title: 'testRoom2222',
                members: [
                    {id: 45, email: 'fishcreek@naver.com', name: 'sayho'},
                    {id: 192, email: 'test@test.com', name: 'tester'},
                ],
            })
            await room.save()
            Log.info(JSON.stringify(room))
            res.json(room)
        })
    )

    // #######################
    /* TEST */
    router.get('/user', (req, res) => {
        userSVC
            .userList()
            .then(list => {
                res.json(Response(ResponseConst.CODE.CODE_SUCCESS, ResponseConst.MSG.MSG_SUCCESS, list))
            })
            .catch(err => res.json(Response(ResponseConst.CODE.CODE_FAILURE, ResponseConst.MSG.MSG_FAILURE, err)))
    })

    router.post('/test', Multipart.any(), (req, res) => {
        // console.log("::")
        console.log(JSON.stringify(req.body))
        console.log(req.body.email)
        console.log(req.body.type)
        chatSVC
            .chatMemberList(34)
            .then(data => {
                res.json(Response(ResponseConst.CODE.CODE_SUCCESS, ResponseConst.MSG.MSG_SUCCESS, data))
            })
            .catch(err => res.json(Response(ResponseConst.CODE.CODE_FAILURE, ResponseConst.MSG.MSG_FAILURE, err)))
    })

    router.post('/test/encrypt', async (req, res) => {
        const ret = await userSVC.testEncryption(req.body.str, req.body.salt === undefined ? null : req.body.salt)
        Log.debug(JSON.stringify(ret))
        res.json(Response(ResponseConst.CODE.CODE_SUCCESS, ResponseConst.MSG.MSG_SUCCESS, ret))
    })

    router.get('/test/get', (req, res) => {
        userSVC
            .getTest('http://193.122.100.94/midnight/shared/public/route.php')
            .then(ret => res.json(ret))
            .catch(err => res.json(err))
    })

    router.get('/test/post', (req, res) => {
        userSVC
            .postTest('http://localhost:3000/api/test')
            .then(ret => res.json(ret))
            .catch(err => res.json(err))
    })

    return {router}
}

export default Api
