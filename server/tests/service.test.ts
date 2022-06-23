// noinspection DuplicatedCode
import {jest} from '@jest/globals'
import Log from '#utils/logger'
import Container from '#src/loaders/container'
import ErrorHandlerUtil from '../src/utils/errorHandler.util'
import MailSender from '../src/utils/mailSender'
import PushManager from '../src/utils/pushManager'
import EncryptUtil from '../src/utils/encrypt.util'
import Config from '../src/configs/config'
import {AverageJob} from '../src/jobs/workers/average.job'
import {makeUserService} from '../src/services/user.service'

const mockUser = {
    id: 45,
    email: 'fishcreek@naver.com',
    password: 'tWzdeZYk/yyGOInQAFtnCdIAatD/ISchM9d71yacM/KlCvzgIGwgJKjv3Wh6QtFeF8xZ1O1IxZyfj/LSvx+goA==',
    name: 'sayho',
    pushToken:
        'es-ktlZ-X_spC7thRilymu:APA91bGU1Q457wILfaaGjsX66wbGkKcEdKjYG2rmofuZIFhS7knQrML_dIumThY5CyXlxyKu7lf1xh74SunZ709GKQY_CNWiHjr1t-vq5drPVwiSISqOpjjtLvGbWKpD1wfYFwE4x_6q',
    status: 1,
    lastPlannerId: 16,
    regDate: '2022-03-12 19:20:10.0',
}

const mockRoundRes = {
    totSellamnt: 3681782000,
    returnValue: 'success',
    drwNoDate: '2002-12-07',
    firstWinamnt: 0,
    firstPrzwnerCo: 0,
    firstAccumamnt: 863604600,
    drwNo: 1,
    drwtNo1: 10,
    drwtNo2: 23,
    drwtNo3: 29,
    drwtNo4: 33,
    drwtNo5: 37,
    drwtNo6: 40,
    bnusNo: 16,
}

const mockLottery = {
    id: 1,
    userId: 45,
    roundNo: 1,
    numberCSV: '2,3,9,18,31,40',
    correctCSV: '',
    bonusNo: '',
    rank: '',
    isProcessed: 0,
    name: 'sayho',
    email: 'fishcreek@naver.com',
}

const mockPlanner = {
    id: 16,
    userId: 45,
    targetDate: '2022-04-22 19:20:10.0',
    color: '#795548',
    title: '제목',
    content: '내용',
    status: 1,
    regDate: '2022-03-12 19:20:10.0',
}

const userService = makeUserService(
    Container.userRepository,
    Container.plannerRepository,
    ErrorHandlerUtil,
    MailSender,
    PushManager,
    EncryptUtil,
    Config.app.AUTH_URI,
    AverageJob
)

describe('UserService', () => {
    describe('signUp', () => {
        beforeEach(() => {
            jest.clearAllMocks()
            jest.spyOn(MailSender, 'sendMailTo').mockReturnValue(Promise.resolve(true))
            jest.spyOn(Container.userRepository, 'addUser').mockReturnValue(Promise.resolve(mockUser.id))
            jest.spyOn(Container.userRepository, 'addAuth').mockReturnValue(Promise.resolve(1))
        })

        test('default flow', async () => {
            const input = {
                email: 'ellivga@dgu.ac.kr',
                name: 'sayho',
                password: 'alclsekf1!',
            }

            const ret = await userService.signUp(input.email, input.name, input.password)
            expect(MailSender.sendMailTo).toHaveBeenCalledTimes(1)
            expect(Container.userRepository.addUser).toHaveBeenCalledTimes(1)
            expect(Container.userRepository.addAuth).toHaveBeenCalledTimes(1)
            expect(ret).toBeInstanceOf(Object)
            expect(ret).toHaveProperty('id')
        })

        test('dulpicate email', async () => {
            jest.spyOn(Container.userRepository, 'getUserByEmail').mockReturnValue(Promise.resolve(mockUser))
            try {
                await userService.signUp('', '', '')
            } catch (error: any) {
                Log.error(error.stack)
                expect(error.status).toBe(409)
                expect(error.message).toBe('중복된 이메일이 존재합니다.')
            }
            expect(Container.userRepository.getUserByEmail).toHaveBeenCalledTimes(1)
        })
    })

    describe('auth', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('default flow', async () => {
            jest.spyOn(Container.userRepository, 'searchAuth').mockReturnValue(
                Promise.resolve([
                    {
                        id: 1,
                        userId: 45,
                        token: 'aaaaaaaa',
                        regDate: '2020-01-01 00:00:00',
                    },
                ])
            )
            jest.spyOn(Container.userRepository, 'updateUserStatus').mockReturnValue(Promise.resolve(1))
            jest.spyOn(Container.userRepository, 'deleteAuth').mockReturnValue(Promise.resolve(1))

            const ret = await userService.auth(45, 'aaaaaaaa')

            expect(Container.userRepository.searchAuth).toHaveBeenCalledTimes(1)
            expect(Container.userRepository.updateUserStatus).toHaveBeenCalledTimes(1)
            expect(Container.userRepository.deleteAuth).toHaveBeenCalledTimes(1)
            expect(ret).toBe(true)
        })

        test('invalid token', async () => {
            jest.spyOn(Container.userRepository, 'searchAuth').mockReturnValue(Promise.resolve([]))
            const ret = await userService.auth(45, 'aaaaaaaa')
            expect(Container.userRepository.searchAuth).toHaveBeenCalledTimes(1)
            expect(ret).toBe(false)
        })
    })
})
