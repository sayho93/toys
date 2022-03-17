class UserSVC {
    constructor({Config, Mappers, Utils, Log, MailSender, PushManager, FileUtil}) {
        this.Config = Config
        this.Mappers = Mappers
        this.Utils = Utils
        this.Log = Log
        this.MailSender = MailSender
        this.PushManager = PushManager
    }

    async signup(data) {
        const [user] = await this.Mappers.userMapper.getUserByEmail(data.email)
        if (user) {
            const err = new Error('중복된 이메일이 존재합니다.')
            err.status = 400
            throw err
        }
        const insertId = await this.Mappers.userMapper.addUser({email: data.email, name: data.name, password: this.Utils.encryptSHA(data.password)})
        if (insertId) {
            const token = Math.random().toString(36).substring(2, 11)
            const [user] = await this.Mappers.userMapper.getUserById(insertId)
            await Promise.all([
                await this.Mappers.userMapper.addAuth({token: token, userId: insertId}),
                this.MailSender.sendMailTo(
                    'Toy Project account verification',
                    `Click following link to verify your account \n${this.Config.app.AUTH_URI}/${user.id}?token=${encodeURI(token)}`,
                    {name: user.name, addr: user.email}
                ),
            ])
            return user
        }
    }

    async auth(userId, token) {
        const chk = await this.Mappers.userMapper.searchAuth(userId, token)
        console.log(chk)
        if (chk.length) {
            await this.Mappers.userMapper.updateUserStatus(userId, 1)
            await this.Mappers.userMapper.deleteAuth(userId)
            return true
        } else return false
    }

    async sendMail() {
        await this.MailSender.sendMailTo('title', 'message', {name: 'sayho', addr: 'fishcreek@naver.com'})
    }

    async login({email, password}) {
        const pass = this.Utils.encryptSHA(password)
        const [user] = await this.Mappers.userMapper.checkLogin({email: email, password: pass})
        return user
    }

    async getUserById(userId) {
        const [user] = await this.Mappers.userMapper.getUserById(userId)
        return user
    }

    async updateToken(userId, token) {
        const [user] = await this.Mappers.userMapper.getUserById(userId)
        if (user) {
            await this.Mappers.userMapper.updateToken(userId, token)
            return true
        } else return false
    }

    async sendPushToAll(message) {
        const users = await this.Mappers.userMapper.getUserHavingToken()
        const registrationKeys = users.map(user => user.pushToken)

        const data = {score: '850', time: '2:45', name: 'test::'}
        await this.PushManager.send(registrationKeys, 'LotGen 알림', message, data)
    }

    async getTest(url) {
        const data = {}
        return await this.Utils.getData(url, data)
    }

    async postTest(url) {
        const data = {
            id: 33,
            type: 2,
            email: 'fishcreek@naver.com',
            nickname: 'testNick',
        }
        return await this.Utils.postData(url, data)
    }

    async setUserNotified(userId) {
        const planner = await this.Mappers.plannerMapper.getLatestPlanner()
        return await this.Mappers.userMapper.setUserNotified({userId, id: planner.id})
    }
}

export default UserSVC

// functional way
// const UserSVC = ({Models, MailSender, PushManager, Utils, Config, Log}) => {
//     const signup = async data => {
//         const user = await Models.userModel.findOne({where: {email: data.email}})
//         if (user) return null
//         const res = await Models.userModel.create({email: data.email, name: data.name, password: Utils.encryptSHA(data.password)})
//         if (res) {
//             const user = await Models.userModel.findOne({where: {email: data.email}})
//             const token = Math.random().toString(36).substring(2, 11)
//             await Models.authModel.create({token: token, userId: user.id})
//             await MailSender.sendMailTo(
//                 'Toy Project account verification',
//                 `Click following link to verify your account \n${Config.app.AUTH_URI}/${user.id}?token=${encodeURI(token)}`,
//                 {
//                     name: user.name,
//                     addr: user.email,
//                 }
//             )
//             return user
//         }
//     }
//
//     const auth = async (userId, token) => {
//         const chk = await Models.authModel.findOne({where: {userId: userId, token: token}, order: [['regDate', 'DESC']]})
//         if (chk) {
//             await Models.userModel.update({status: 1}, {where: {id: userId}})
//             await Models.authModel.destroy({where: {userId: userId}})
//             return true
//         } else return false
//     }
//
//     const login = async ({email, password}) => {
//         const pass = Utils.encryptSHA(password)
//         console.log(pass)
//         console.log(Utils.createSalt())
//         console.log(await Utils.encryptSHAWithSalt(pass, Utils.createSalt()))
//         return await Models.userModel.findOne({where: {email: email, password: pass, status: 1}})
//     }
//
//     const betaUserList = async query => {
//         let option = {
//             where: {
//                 status: 1,
//             },
//             order: [['regDate', 'DESC']],
//         }
//         if (query) {
//             const Op = this.Models.Sequelize.Op
//             option = {
//                 where: {
//                     status: 1,
//                     [Op.or]: [{email: {[Op.like]: `%${query}%`}}, {name: {[Op.like]: `%${query}%`}}, {phone: {[Op.like]: `%${query}%`}}],
//                 },
//                 order: [['regDate', 'DESC']],
//             }
//         }
//         console.log(JSON.stringify(option))
//         return await Models.betaUserModel.findAll(option)
//     }
//
//     const addBetaUser = async data => {
//         const res = await Models.betaUserModel.create({email: data.email, name: data.name, age: data.age === '' ? 0 : data.age, phone: data.phone, sex: data.sex})
//         Log.info(res)
//         return res
//     }
//
//     const deleteBetaUser = async id => {
//         return await Models.betaUserModel.update({status: 0}, {where: {id: id}})
//     }
//
//     const userList = async () => {
//         const users = await Models.userModel.findAll()
//         Log.info(JSON.stringify(users))
//         return users
//     }
//
//     const getUser = async id => {
//         return await Models.userModel.findByPk(id)
//     }
//
//     const sendPushToAll = async () => {
//         const users = await Models.userModel.findAll({where: {pushToken: {[Op.not]: null}}})
//         const registrationKeys = users.map(user => user.pushToken)
//         const message = `생성자가 여러 차례 호출되더라도 실제로 생성되는 객체는 하나이고 최초 생성 이후에 호출된 생성자는
//                     최초의 생성자가 생성한 객체를 리턴한다. 이와 같은 디자인 유형을 싱글턴 패턴이라고 한다. 주로 공통된 객체를
//                     여러개 생성해서 사용하는 DBCP(DataBase Connection Pool)와 같은 상황에서 많이 사용된다.`
//         const data = {
//             score: '850',
//             time: '2:45',
//             name: 'test::',
//         }
//         const test = [
//             'fmargQ_NSo6f2FPSI-0XJC:APA91bFkQNn2mcPfa3Vv-PIU402tEiuu3s14fDAIQHWdGLoLdj_Z7z75SnuHQNFNatl_vIJctX5ERu5riXrMV63f0FYmZWQzH_vGHE6YMSIc2Yj9XMa8BY-zJuEcVW0ZbnpXoIsls35F',
//             'eFlw8n25Q9yCkVHwYXUMgq:APA91bHP8pSW90s788fpB9rzHTroXNGS-F8Bi6Ey1G3SfPa0QeyXsC3V7irfR-lvx2iFCTYNy_G8yois1RDAS4HdCzjmJv-ifBSnruSctSw0JikE1eAb4Ltei6teiy2rKgv1RBYlIv2H',
//         ]
//
//         await PushManager.send(test, '미드나잇 지역 게시글 알림', message, data)
//     }
//
//     const sendMail = async () => {
//         const single = {addr: '', name: ''}
//         const mailList = await Models.userModel.findAll({where: {email: {[Op.not]: null}}})
//         single.addr = mailList[0].email
//         single.name = mailList[0].name
//         const list = mailList.map(item => ({addr: item.email, name: item.name}))
//         // await MailSender.sendMailTo('title', 'message', single)
//         await MailSender.sendMailToMulti('title', 'message', list)
//     }
//
//     const testEncryption = async (str, salt = null) => {
//         const ret = await Utils.encryptSHAWithSalt(str, salt)
//         Log.debug(JSON.stringify(ret))
//         return ret
//     }
//
//     const getTest = async url => {
//         const data = {
//             F: 'WebRoute.myMatchStat.raw',
//             myId: 128,
//             flag: 'recv',
//         }
//         return await Utils.getData(url, data)
//     }
//
//     const postTest = async url => {
//         const data = {
//             id: 33,
//             type: 2,
//             email: 'fishcreek@naver.com',
//             nickname: 'testNick',
//         }
//         return await Utils.postData(url, data)
//     }
//
//     return {signup, auth, login, betaUserList, addBetaUser, deleteBetaUser, userList, getUser, sendPushToAll, sendMail, testEncryption, getTest, postTest}
// }
//
// export default UserSVC
