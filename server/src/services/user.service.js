import Config from '#configs/config'

const UserService = ({UserRepository, PlannerRepository, Utils, MailSender, PushManager, AverageJob}) => {
    const signUp = async data => {
        const [user] = await UserRepository.getUserByEmail(data.email)
        if (user) {
            const err = new Error('중복된 이메일이 존재합니다.')
            err.status = 400
            throw err
        }

        const insertId = await UserRepository.addUser({email: data.email, name: data.name, password: Utils.encryptSHA(data.password)})
        if (!insertId) {
            const err = new Error('회원가입에 실패했습니다.')
            err.status = 400
            throw err
        }

        const token = Math.random().toString(36).substring(2, 11)
        const [newUser] = await UserRepository.getUserById(insertId)
        await Promise.all([
            await UserRepository.addAuth({token: token, userId: insertId}),
            MailSender.sendMailTo(
                'Toy Project account verification',
                `Click following link to verify your account \n${Config.app.AUTH_URI}/${newUser.id}?token=${encodeURI(token)}`,
                {name: newUser.name, addr: newUser.email}
            ),
        ])

        if (newUser) delete newUser.password
        return newUser
    }

    const auth = async (userId, token) => {
        const chk = await UserRepository.searchAuth(userId, token)
        if (!chk.length) return false

        await UserRepository.updateUserStatus(userId, 1)
        await UserRepository.deleteAuth(userId)
        return true
    }

    const login = async ({email, password}) => {
        const pass = Utils.encryptSHA(password)
        const [user] = await UserRepository.checkLogin({email: email, password: pass})

        let err
        if (!user) err = new Error('이메일이나 비밀번호가 잘못되었습니다.')
        else if (user.status === 0) err = new Error('이메일 인증 후 로그인 해주세요.')

        if (err) {
            err.status = 400
            throw err
        }
        return user
    }

    const getUserById = async userId => {
        const [user] = await UserRepository.getUserById(userId)
        if (!user) {
            const err = new Error('존재하지 않는 유저입니다.')
            err.status = 404
            throw err
        }
        delete user.password
        return user
    }

    const updateToken = async (userId, token) => {
        const [user] = await UserRepository.getUserById(userId)
        if (!user) {
            const err = new Error('존재하지 않는 유저입니다.')
            err.status = 404
            throw err
        }
        return await UserRepository.updateToken(userId, token)
    }

    const sendPushToAll = async message => {
        const target = await UserRepository.getUserHavingToken()
        const registrationKeys = target.map(user => user.pushToken)

        console.log(target)
        await PushManager.send(registrationKeys, 'LotGen 알림', message)
    }

    const setUserNotified = async userId => {
        const planner = await PlannerRepository.getLatestPlanner()
        if (planner) await UserRepository.setUserNotified({userId, id: planner.id})
        return true
    }

    const testEmail = async message => {
        const [target] = await UserRepository.getUserById(45)
        console.log(target)
        await MailSender.sendMailTo('Test mail', message, {name: target.name, addr: target.email})
    }

    const testPush = async message => {
        const target = await UserRepository.getUserById(45)
        const registrationKeys = target.map(user => user.pushToken)
        console.log(target)
        await PushManager.send(registrationKeys, 'LotGen 알림', message)
    }

    const workerTest = async num => {
        return await AverageJob(num)
    }

    return {
        signUp,
        auth,
        login,
        getUserById,
        updateToken,
        sendPushToAll,
        setUserNotified,
        testEmail,
        testPush,
        workerTest,
    }
}

export default UserService
