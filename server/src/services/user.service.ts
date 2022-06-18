import {Utils} from '#types/utils'
import Encryptor = Utils.Encryptor
import MailSender = Utils.MailSender
import PushManager = Utils.PushManager
import ErrorHandler = Utils.ErrorHandler
import UserRepository = Repositories.UserRepository
import PlannerRepository = Repositories.PlannerRepository
import UserService = Services.UserService

export const makeUserService = (
    UserRepository: UserRepository,
    PlannerRepository: PlannerRepository,
    ErrorHandler: ErrorHandler,
    MailSender: MailSender,
    PushManager: PushManager,
    EncryptUtil: Encryptor,
    AUTH_URI: string,
    AverageJob: Jobs.workers.AverageJob
): UserService => {
    const signUp = async (email: string, name: string, password: string) => {
        const user = await UserRepository.getUserByEmail(email)
        if (user) {
            throw ErrorHandler.BaseError('중복된 이메일이 존재합니다.', 409)
        }

        const insertId = await UserRepository.addUser({
            pushToken: '',
            email: email,
            name: name,
            password: EncryptUtil.encryptSHA(password),
        })

        if (!insertId) throw ErrorHandler.BaseError('회원가입에 실패했습니다.', 500)

        const token = Math.random().toString(36).substring(2, 11)
        const [newUser] = await UserRepository.getUserById(insertId)
        await Promise.all([
            await UserRepository.addAuth(insertId, token),
            MailSender.sendMailTo(
                'Toy Project account verification',
                `Click following link to verify your account \n${AUTH_URI}/${newUser.id}?token=${encodeURI(token)}`,
                {name: newUser.name, addr: newUser.email}
            ),
        ])

        if (newUser) delete newUser.password
        return newUser
    }

    const auth = async (userId: number, token: string) => {
        const chk = await UserRepository.searchAuth(userId, token)
        if (!chk.length) return false

        await UserRepository.updateUserStatus(userId, 1)
        await UserRepository.deleteAuth(userId)
        return true
    }

    const login = async ({email, password}: {email: string; password: string}) => {
        const pass = EncryptUtil.encryptSHA(password)
        const user = await UserRepository.checkLogin({pushToken: '', email: email, password: pass})

        if (!user) throw ErrorHandler.BaseError('이메일이나 비밀번호가 잘못되었습니다.', 400)
        if (user.status === 0) throw ErrorHandler.BaseError('이메일 인증 후 로그인 해주세요.', 400)

        return user
    }

    const getUserById = async (userId: number) => {
        const user: DTO.UserDTO = await UserRepository.getUserById(userId)
        if (!user) throw ErrorHandler.BaseError('존재하지 않는 유저입니다.', 404)
        delete user.password
        return user
    }

    const updateToken = async (userId: number, token: string) => {
        const [user] = await UserRepository.getUserById(userId)
        if (!user) throw ErrorHandler.BaseError('존재하지 않는 유저입니다.', 404)
        return await UserRepository.updateToken(userId, token)
    }

    const sendPushToAll = async (message: string) => {
        const target = await UserRepository.getUserHavingToken()
        const registrationKeys = target.map(user => user.pushToken)

        console.log(target)
        await PushManager.send(registrationKeys, 'LotGen 알림', message)
    }

    const setUserNotified = async (userId: number) => {
        const planner = await PlannerRepository.getLatestPlanner()
        if (!planner.id) return false
        if (planner) await UserRepository.setUserNotified(userId, planner.id)
        return true
    }

    const testEmail = async (message: string) => {
        const target = await UserRepository.getUserById(45)
        console.log(target)
        await MailSender.sendMailTo('Test mail', message, {name: target.name, addr: target.email})
    }

    const testPush = async (message: string) => {
        const target = await UserRepository.getUserById(45)
        const registrationKeys = [target].map((user: DTO.UserDTO) => user.pushToken)
        console.log(target)
        await PushManager.send(registrationKeys, 'LotGen 알림', message)
    }

    const workerTest = async (num: number) => {
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
