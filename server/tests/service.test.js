// noinspection DuplicatedCode
import {jest} from '@jest/globals'
import Log from '#utils/logger'

import Container from '#src/loaders/container'

import UserService from '#services/user.service'
import LotteryService from '#services/lottery.service'
import PlannerService from '#services/planner.service'
import {asValue} from 'awilix'

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

const container = await Container.init()

const Config = Container.get('Config')

const UserRepository = Container.get('UserRepository')
const LotteryRepository = Container.get('LotteryRepository')
const PlannerRepository = Container.get('PlannerRepository')

const DateUtil = Container.get('DateUtil')
const EncryptUtil = Container.get('EncryptUtil')
const ErrorHandlerUtil = Container.get('ErrorHandlerUtil')
const FileUtil = Container.get('FileUtil')
const HttpUtil = Container.get('HttpUtil')
const MailSender = Container.get('MailSender')
const PushManager = Container.get('PushManager')

const AverageJob = Container.get('AverageJob')

container.register({
    Config: asValue(Config),

    UserRepository: asValue(UserRepository),
    LotteryRepository: asValue(LotteryRepository),
    PlannerRepository: asValue(PlannerRepository),

    DateUtil: asValue(DateUtil),
    EncryptUtil: asValue(EncryptUtil),
    ErrorHandler: asValue(ErrorHandlerUtil),
    FileUtil: asValue(FileUtil),
    HttpUtil: asValue(HttpUtil),
    MailSender: asValue(MailSender),
    PushManager: asValue(PushManager),

    AverageJob: asValue(AverageJob),
})

describe('UserService', () => {
    const userService = UserService({
        Config,
        UserRepository,
        PlannerRepository,
        EncryptUtil,
        MailSender,
        PushManager,
        AverageJob,
    })

    describe('signUp', () => {
        beforeEach(() => {
            jest.clearAllMocks()
            jest.spyOn(MailSender, 'sendMailTo').mockReturnValue(true)
            jest.spyOn(UserRepository, 'addUser').mockReturnValue(45)
            jest.spyOn(UserRepository, 'addAuth').mockReturnValue(true)
        })

        test('default flow', async () => {
            const input = {
                email: 'ellivga@dgu.ac.kr',
                name: 'sayho',
                password: 'alclsekf1!',
            }
            const ret = await userService.signUp(input)
            expect(MailSender.sendMailTo).toHaveBeenCalledTimes(1)
            expect(UserRepository.addUser).toHaveBeenCalledTimes(1)
            expect(UserRepository.addAuth).toHaveBeenCalledTimes(1)
            expect(ret).toBeInstanceOf(Object)
            expect(ret).toHaveProperty('id')
        })

        test('duplicated email', async () => {
            jest.spyOn(UserRepository, 'getUserByEmail').mockReturnValue([mockUser])
            try {
                await userService.signUp({})
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('중복된 이메일이 존재합니다.')
                err.status = 400
                expect(err).toEqual(err)
            }
            expect(UserRepository.getUserByEmail).toHaveBeenCalledTimes(1)
        })
    })

    describe('auth', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('default flow', async () => {
            jest.spyOn(UserRepository, 'searchAuth').mockReturnValue([
                {
                    id: 1,
                    userId: 45,
                    token: 'aaaaaaaa',
                    regDate: '2020-01-01 00:00:00',
                },
            ])
            jest.spyOn(UserRepository, 'updateUserStatus').mockReturnValue(true)
            jest.spyOn(UserRepository, 'deleteAuth').mockReturnValue(true)

            const ret = await userService.auth(45, 'aaaaaaaa')

            expect(UserRepository.searchAuth).toHaveBeenCalledTimes(1)
            expect(UserRepository.updateUserStatus).toHaveBeenCalledTimes(1)
            expect(UserRepository.deleteAuth).toHaveBeenCalledTimes(1)
            expect(ret).toBe(true)
        })

        test('invalid token', async () => {
            jest.spyOn(UserRepository, 'searchAuth').mockReturnValue([])
            const ret = await userService.auth(45, 'aaaaaaaa')
            expect(UserRepository.searchAuth).toHaveBeenCalledTimes(1)
            expect(ret).toBe(false)
        })
    })

    describe('login', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('default flow', async () => {
            jest.spyOn(UserRepository, 'checkLogin').mockReturnValue([mockUser])
            const ret = await userService.login({email: '', password: ''})
            expect(UserRepository.checkLogin).toHaveBeenCalledTimes(1)
            expect(ret).toBe(mockUser)
        })

        test('there is no matching user', async () => {
            jest.spyOn(UserRepository, 'checkLogin').mockReturnValue([])
            try {
                await userService.login({email: '', password: ''})
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('이메일이나 비밀번호가 잘못되었습니다.')
                err.status = 400
                expect(err).toEqual(err)
            }
            expect(UserRepository.checkLogin).toHaveBeenCalledTimes(1)
        })

        test('not authorized', async () => {
            const tmpMockUser = {
                ...mockUser,
                status: 0,
            }
            jest.spyOn(UserRepository, 'checkLogin').mockReturnValue([tmpMockUser])
            try {
                await userService.login({email: '', password: ''})
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('이메일 인증 후 로그인 해주세요.')
                err.status = 400
                expect(err).toEqual(err)
            }
            expect(UserRepository.checkLogin).toHaveBeenCalledTimes(1)
        })
    })

    describe('getUserById', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('default flow', async () => {
            jest.spyOn(UserRepository, 'getUserById').mockReturnValue([mockUser])
            const ret = await userService.getUserById(0)
            expect(UserRepository.getUserById).toHaveBeenCalledTimes(1)
            expect(ret).toBeInstanceOf(Object)
            expect(ret).toHaveProperty('id')
        })

        test('not exists', async () => {
            jest.spyOn(UserRepository, 'getUserById').mockReturnValue([])
            try {
                await userService.getUserById(0)
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('존재하지 않는 유저입니다.')
                err.status = 400
                expect(err).toEqual(err)
            }
            expect(UserRepository.getUserById).toHaveBeenCalledTimes(1)
        })
    })

    describe('updateToken', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('default flow', async () => {
            jest.spyOn(UserRepository, 'getUserById').mockReturnValue([mockUser])
            jest.spyOn(UserRepository, 'updateToken').mockReturnValue(true)
            const ret = await userService.updateToken(0, 'token')
            expect(UserRepository.getUserById).toHaveBeenCalledTimes(1)
            expect(UserRepository.updateToken).toHaveBeenCalledTimes(1)
            expect(ret).toBe(true)
        })

        test('not exists', async () => {
            jest.spyOn(UserRepository, 'getUserById').mockReturnValue([])
            try {
                await userService.updateToken(0, 'token')
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('존재하지 않는 유저입니다.')
                err.status = 400
                expect(err).toEqual(err)
            }
            expect(UserRepository.getUserById).toHaveBeenCalledTimes(1)
        })

        test('database error', async () => {
            jest.spyOn(UserRepository, 'getUserById').mockReturnValue([mockUser])
            jest.spyOn(UserRepository, 'updateToken').mockImplementation(() => {
                const err = new Error('database error')
                err.status = 500
                throw err
            })
            try {
                await userService.updateToken(0, 'token')
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('database error')
                err.status = 500
                expect(err).toEqual(err)
            }

            expect(UserRepository.getUserById).toHaveBeenCalledTimes(1)
            expect(UserRepository.updateToken).toHaveBeenCalledTimes(1)
        })
    })

    describe('setUserNotified', () => {
        beforeEach(() => {
            jest.clearAllMocks()
            jest.spyOn(UserRepository, 'setUserNotified').mockReturnValue(true)
        })

        test('default flow', async () => {
            jest.spyOn(PlannerRepository, 'getLatestPlanner').mockReturnValue([mockPlanner])
            const ret = await userService.setUserNotified(0)
            expect(PlannerRepository.getLatestPlanner).toHaveBeenCalledTimes(1)
            expect(UserRepository.setUserNotified).toHaveBeenCalledTimes(1)
            expect(ret).toBe(true)
        })

        test('planner doesnt exists', async () => {
            jest.spyOn(PlannerRepository, 'getLatestPlanner').mockReturnValue([])
            const ret = await userService.setUserNotified(0)
            expect(PlannerRepository.getLatestPlanner).toHaveBeenCalledTimes(1)
            expect(UserRepository.setUserNotified).toHaveBeenCalledTimes(1)
            expect(ret).toBe(true)
        })
    })
})

describe('LotteryService', () => {
    const lotteryService = LotteryService({
        LotteryRepository,
        UserRepository,
        DateUtil,
        HttpUtil,
        MailSender,
        PushManager,
    })

    describe('saveLottery', () => {
        test('default flow', async () => {
            jest.spyOn(LotteryRepository, 'addLottery').mockReturnValue(0)
            const ret = await lotteryService.saveLottery(0, {})
            Log.debug(JSON.stringify(ret))
            expect(LotteryRepository.addLottery).toHaveBeenCalledTimes(1)
            expect(ret).toBe(0)
        })
    })

    describe('getLotteryList', () => {
        test('default flow', async () => {
            jest.spyOn(LotteryRepository, 'getLotteryList')
            const ret = await lotteryService.getLotteryList()
            expect(LotteryRepository.getLotteryList).toHaveBeenCalledTimes(1)
            expect(ret).toBeInstanceOf(Array)
        })
    })

    describe('getFameList', () => {
        test('default flow', async () => {
            jest.spyOn(LotteryRepository, 'getLotteryFameList')
            const ret = await lotteryService.getFameList()
            expect(LotteryRepository.getLotteryList).toHaveBeenCalledTimes(1)
            expect(ret).toBeInstanceOf(Array)
        })
    })

    describe('batchProcess', () => {
        beforeEach(() => {
            jest.clearAllMocks()
            jest.spyOn(DateUtil, 'getWeek').mockReturnValue(1)
            jest.spyOn(HttpUtil, 'getData').mockReturnValue(mockRoundRes)
            jest.spyOn(LotteryRepository, 'updateLottery').mockReturnValue(true)
            jest.spyOn(MailSender, 'sendMailTo').mockReturnValue(true)
            jest.spyOn(PushManager, 'send').mockReturnValue(true)
        })

        test('nothing to process', async () => {
            jest.spyOn(LotteryRepository, 'getBatchTargetList').mockReturnValue([])
            await lotteryService.batchProcess()
            expect(DateUtil.getWeek).toHaveBeenCalledTimes(1)
            expect(LotteryRepository.getBatchTargetList).toHaveBeenCalledTimes(1)

            expect(HttpUtil.getData).toHaveBeenCalledTimes(0)
            expect(LotteryRepository.updateLottery).toHaveBeenCalledTimes(0)
            expect(MailSender.sendMailTo).toHaveBeenCalledTimes(0)
            expect(PushManager.send).toHaveBeenCalledTimes(0)
        })

        test('no one won', async () => {
            jest.spyOn(LotteryRepository, 'getBatchTargetList').mockReturnValue([
                {...mockLottery, id: 1, roundNo: 1, numberCSV: '2,3,9,18,31,40'},
                {...mockLottery, id: 2, roundNo: 1, numberCSV: '1,7,15,19,31,35'},
            ])

            await lotteryService.batchProcess()
            expect(DateUtil.getWeek).toHaveBeenCalledTimes(1)
            expect(LotteryRepository.getBatchTargetList).toHaveBeenCalledTimes(1)
            expect(HttpUtil.getData).toHaveBeenCalledTimes(1)

            expect(LotteryRepository.updateLottery).toHaveBeenCalledTimes(2)
            expect(MailSender.sendMailTo).toHaveBeenCalledTimes(0)
            expect(PushManager.send).toHaveBeenCalledTimes(0)
        })

        test('1won - 1st', async () => {
            jest.spyOn(LotteryRepository, 'getBatchTargetList').mockReturnValue([
                {...mockLottery, id: 1, roundNo: 1, numberCSV: '2,3,9,18,31,40'},
                {...mockLottery, id: 2, roundNo: 1, numberCSV: '10,23,29,33,37,40'},
            ])

            // PushManager.send.mockRestore()
            // MailSender.sendMailTo.mockRestore()

            await lotteryService.batchProcess()
            expect(DateUtil.getWeek).toHaveBeenCalledTimes(1)
            expect(LotteryRepository.getBatchTargetList).toHaveBeenCalledTimes(1)
            expect(HttpUtil.getData).toHaveBeenCalledTimes(1)

            expect(LotteryRepository.updateLottery).toHaveBeenCalledTimes(2)
            expect(MailSender.sendMailTo).toHaveBeenCalledTimes(1)
            expect(PushManager.send).toHaveBeenCalledTimes(1)

            expect(PushManager.send).toHaveBeenCalledWith(
                [
                    'es-ktlZ-X_spC7thRilymu:APA91bGU1Q457wILfaaGjsX66wbGkKcEdKjYG2rmofuZIFhS7knQrML_dIumThY5CyXlxyKu7lf1xh74SunZ709GKQY_CNWiHjr1t-vq5drPVwiSISqOpjjtLvGbWKpD1wfYFwE4x_6q',
                ],
                `1회 당첨자 발표입니다.`,
                '1등 당첨을 축하합니다!'
            )
        })

        test('draw delayed (api with current week returns failed)', async () => {
            jest.spyOn(HttpUtil, 'getData')
                .mockReturnValueOnce({returnValue: 'fail'})
                .mockReturnValueOnce({...mockLottery, drwNo: 0})
            jest.spyOn(LotteryRepository, 'getBatchTargetList').mockReturnValue([
                {...mockLottery, id: 1, roundNo: 1, numberCSV: '2,3,9,18,31,40'},
                {...mockLottery, id: 2, roundNo: 0, numberCSV: '1,2,3,4,31,35'},
            ])

            await lotteryService.batchProcess()
            expect(DateUtil.getWeek).toHaveBeenCalledTimes(1)
            expect(LotteryRepository.getBatchTargetList).toHaveBeenCalledTimes(1)
            expect(HttpUtil.getData).toHaveBeenCalledTimes(2)

            expect(LotteryRepository.updateLottery).toHaveBeenCalledTimes(2)
            expect(MailSender.sendMailTo).toHaveBeenCalledTimes(0)
            expect(PushManager.send).toHaveBeenCalledTimes(0)
        })
    })
})

describe('PlannerService', () => {
    const plannerService = PlannerService({
        PlannerRepository,
        UserRepository,
        PushManager,
    })

    describe('getPlanners', () => {
        test('default flow', async () => {
            jest.spyOn(PlannerRepository, 'getPlannerList')

            const ret = await plannerService.getPlanners()
            expect(PlannerRepository.getPlannerList).toHaveBeenCalledTimes(1)
            expect(ret).toBeInstanceOf(Array)
        })
    })

    describe('savePlanner', () => {
        beforeEach(() => {
            jest.clearAllMocks()
            jest.spyOn(UserRepository, 'getUserById').mockReturnValue([mockUser])
            jest.spyOn(PlannerRepository, 'savePlanner').mockReturnValue(1)
            jest.spyOn(UserRepository, 'getUserHavingToken').mockReturnValue([mockUser])
            jest.spyOn(PushManager, 'send').mockReturnValue(true)
        })

        test('new plan', async () => {
            const ret = await plannerService.savePlanner({userId: mockUser.id})

            expect(UserRepository.getUserById).toHaveBeenCalledTimes(1)
            expect(PlannerRepository.savePlanner).toHaveBeenCalledTimes(1)
            expect(UserRepository.getUserHavingToken).toHaveBeenCalledTimes(1)
            expect(PushManager.send).toHaveBeenCalledTimes(1)
            expect(typeof ret).toBe('number')
        })

        test('patch existing plan', async () => {
            const ret = await plannerService.savePlanner({userId: mockUser.id, id: 1})

            expect(UserRepository.getUserById).toHaveBeenCalledTimes(1)
            expect(PlannerRepository.savePlanner).toHaveBeenCalledTimes(1)
            expect(UserRepository.getUserHavingToken).toHaveBeenCalledTimes(0)
            expect(PushManager.send).toHaveBeenCalledTimes(0)
            expect(typeof ret).toBe('number')
        })
    })

    test('deletePlanner', async () => {
        jest.spyOn(PlannerRepository, 'deletePlanner').mockReturnValue(1)
        const ret = await plannerService.deletePlanner(1)
        expect(PlannerRepository.deletePlanner).toHaveBeenCalledTimes(1)
        expect(ret).toBe(1)
    })

    test('getLatest', async () => {
        jest.spyOn(PlannerRepository, 'getLatestPlanner').mockReturnValue([mockPlanner])
        const ret = await plannerService.getLatest()
        expect(PlannerRepository.getLatestPlanner).toHaveBeenCalledTimes(1)
        expect(ret).toBeInstanceOf(Array)
    })
})
