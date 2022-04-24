// noinspection DuplicatedCode
import {jest} from '@jest/globals'
import Log from '#utils/logger'

import {Repositories} from '#src/loaders/dependencies'

import {encryptSHA, getData, getWeek} from '#utils/common.util'
import MailSender from '#utils/MailSender'
import PushManager from '#utils/PushManager'

import UserService from '#services/user.service'
import LotteryService from '#services/lottery.service'

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

describe('UserService', () => {
    const userService = UserService({
        Repositories: {
            userRepository: Repositories.userRepository,
            plannerRepository: Repositories.plannerRepository,
        },
        Utils: {encryptSHA},
        MailSender,
        PushManager,
    })

    describe('signUp', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        const mailSenderSpy = jest.spyOn(MailSender, 'sendMailTo').mockReturnValue(true)
        const addUserSpy = jest.spyOn(Repositories.userRepository, 'addUser').mockReturnValue(45)
        const addAuthSpy = jest.spyOn(Repositories.userRepository, 'addAuth').mockReturnValue(true)

        test('original flow', async () => {
            const input = {
                email: 'ellivga@dgu.ac.kr',
                name: 'sayho',
                password: 'alclsekf1!',
            }
            const ret = await userService.signUp(input)
            Log.debug(JSON.stringify(ret))
            expect(mailSenderSpy).toHaveBeenCalledTimes(1)
            expect(addUserSpy).toHaveBeenCalledTimes(1)
            expect(addAuthSpy).toHaveBeenCalledTimes(1)
            expect(ret).toBeInstanceOf(Object)
            expect(ret).toHaveProperty('id')
        })

        test('duplicated email', async () => {
            const getUserByEmailSpy = jest.spyOn(Repositories.userRepository, 'getUserByEmail').mockReturnValue([mockUser])

            try {
                const ret = await userService.signUp({})
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('중복된 이메일이 존재합니다.')
                err.status = 400
                expect(err).toEqual(err)
            }

            expect(getUserByEmailSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('auth', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('original flow', async () => {
            const searchAuthSpy = jest.spyOn(Repositories.userRepository, 'searchAuth').mockReturnValue([
                {
                    id: 1,
                    userId: 45,
                    token: 'aaaaaaaa',
                    regDate: '2020-01-01 00:00:00',
                },
            ])
            const updateUserStatusSpy = jest.spyOn(Repositories.userRepository, 'updateUserStatus').mockReturnValue(true)
            const deleteAuthSpy = jest.spyOn(Repositories.userRepository, 'deleteAuth').mockReturnValue(true)

            const ret = await userService.auth(45, 'aaaaaaaa')
            Log.debug(JSON.stringify(ret))

            expect(searchAuthSpy).toHaveBeenCalledTimes(1)
            expect(updateUserStatusSpy).toHaveBeenCalledTimes(1)
            expect(deleteAuthSpy).toHaveBeenCalledTimes(1)
            expect(ret).toBe(true)
        })

        test('invalid token', async () => {
            const searchAuthSpy = jest.spyOn(Repositories.userRepository, 'searchAuth').mockReturnValue([])

            const ret = await userService.auth(45, 'aaaaaaaa')
            Log.debug(JSON.stringify(ret))

            expect(searchAuthSpy).toHaveBeenCalledTimes(1)
            expect(ret).toBe(false)
        })
    })

    describe('login', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('original flow', async () => {
            const checkLoginSpy = jest.spyOn(Repositories.userRepository, 'checkLogin').mockReturnValue([mockUser])
            const ret = await userService.login({email: '', password: ''})
            Log.debug(JSON.stringify(ret))
            expect(checkLoginSpy).toHaveBeenCalledTimes(1)
            expect(ret).toBe(mockUser)
        })

        test('there is no matching user', async () => {
            const checkLoginSpy = jest.spyOn(Repositories.userRepository, 'checkLogin').mockReturnValue([])
            try {
                const ret = await userService.login({email: '', password: ''})
                Log.debug(JSON.stringify(ret))
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('이메일이나 비밀번호가 잘못되었습니다.')
                err.status = 400
                expect(err).toEqual(err)
            }
            expect(checkLoginSpy).toHaveBeenCalledTimes(1)
        })

        test('not authorized', async () => {
            const tmpMockUser = {
                ...mockUser,
                status: 0,
            }
            const checkLoginSpy = jest.spyOn(Repositories.userRepository, 'checkLogin').mockReturnValue([tmpMockUser])
            try {
                const ret = await userService.login({email: '', password: ''})
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('이메일 인증 후 로그인 해주세요.')
                err.status = 400
                expect(err).toEqual(err)
            }
            expect(checkLoginSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('getUserById', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('original flow', async () => {
            const getUserByIdSpy = jest.spyOn(Repositories.userRepository, 'getUserById').mockReturnValue([mockUser])
            const ret = await userService.getUserById(0)
            Log.debug(JSON.stringify(ret))
            expect(getUserByIdSpy).toHaveBeenCalledTimes(1)
            expect(ret).toBeInstanceOf(Object)
            expect(ret).toHaveProperty('id')
        })

        test('not exists', async () => {
            const getUserByIdSpy = jest.spyOn(Repositories.userRepository, 'getUserById').mockReturnValue([])
            try {
                const ret = await userService.getUserById(0)
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('존재하지 않는 유저입니다.')
                err.status = 400
                expect(err).toEqual(err)
            }
            expect(getUserByIdSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('updateToken', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('original flow', async () => {
            const getUserByIdSpy = jest.spyOn(Repositories.userRepository, 'getUserById').mockReturnValue([mockUser])
            const updateTokenSpy = jest.spyOn(Repositories.userRepository, 'updateToken').mockReturnValue(true)
            const ret = await userService.updateToken(0, 'token')
            Log.debug(JSON.stringify(ret))
            expect(getUserByIdSpy).toHaveBeenCalledTimes(1)
            expect(updateTokenSpy).toHaveBeenCalledTimes(1)
            expect(ret).toBe(true)
        })

        test('not exists', async () => {
            const getUserByIdSpy = jest.spyOn(Repositories.userRepository, 'getUserById').mockReturnValue([])
            try {
                const ret = await userService.updateToken(0, 'token')
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('존재하지 않는 유저입니다.')
                err.status = 400
                expect(err).toEqual(err)
            }

            expect(getUserByIdSpy).toHaveBeenCalledTimes(1)
        })

        test('database error', async () => {
            const getUserByIdSpy = jest.spyOn(Repositories.userRepository, 'getUserById').mockReturnValue([mockUser])
            const updateTokenSpy = jest.spyOn(Repositories.userRepository, 'updateToken').mockImplementation(() => {
                const err = new Error('database error')
                err.status = 500
                throw err
            })
            try {
                const ret = await userService.updateToken(0, 'token')
            } catch (error) {
                Log.error(error.stack)
                const err = new Error('database error')
                err.status = 500
                expect(err).toEqual(err)
            }

            expect(getUserByIdSpy).toHaveBeenCalledTimes(1)
            expect(updateTokenSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('setUserNotified', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })
        const setUserNotifiedSpy = jest.spyOn(Repositories.userRepository, 'setUserNotified').mockReturnValue(true)

        test('original flow', async () => {
            const getLatestPlannerSpy = jest.spyOn(Repositories.plannerRepository, 'getLatestPlanner').mockReturnValue([mockPlanner])
            const ret = await userService.setUserNotified(0)
            Log.debug(JSON.stringify(ret))
            expect(getLatestPlannerSpy).toHaveBeenCalledTimes(1)
            expect(setUserNotifiedSpy).toHaveBeenCalledTimes(1)
            expect(ret).toBe(true)
        })

        test('planner doesnt exists', async () => {
            const getLatestPlannerSpy = jest.spyOn(Repositories.plannerRepository, 'getLatestPlanner').mockReturnValue([])
            const ret = await userService.setUserNotified(0)
            Log.debug(JSON.stringify(ret))
            expect(getLatestPlannerSpy).toHaveBeenCalledTimes(1)
            expect(setUserNotifiedSpy).toHaveBeenCalledTimes(1)
            expect(ret).toBe(true)
        })
    })
})

describe('LotteryService', () => {
    const Utils = {getWeek, getData}
    const lotteryService = LotteryService({
        Repositories: {
            lotteryRepository: Repositories.lotteryRepository,
            userRepository: Repositories.userRepository,
        },
        Utils,
        MailSender,
        PushManager,
    })

    describe('saveLottery', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('original flow', async () => {
            const addLotterySpy = jest.spyOn(Repositories.lotteryRepository, 'addLottery').mockReturnValue(0)

            const ret = await lotteryService.saveLottery(0, {})
            Log.debug(JSON.stringify(ret))
            expect(addLotterySpy).toHaveBeenCalledTimes(1)
            expect(ret).toBe(0)
        })
    })

    describe('getLotteryList', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        test('original flow', async () => {
            const getLotteryListSpy = jest.spyOn(Repositories.lotteryRepository, 'getLotteryList')
            const ret = await lotteryService.getLotteryList()
            Log.debug(JSON.stringify(ret))
            expect(getLotteryListSpy).toHaveBeenCalledTimes(1)
            expect(ret).toBeInstanceOf(Array)
        })
    })

    describe('getFameList', () => {
        test('original flow', async () => {
            const getFameListSpy = jest.spyOn(Repositories.lotteryRepository, 'getLotteryFameList')
            const ret = await lotteryService.getFameList()
            Log.debug(JSON.stringify(ret))
            expect(getFameListSpy).toHaveBeenCalledTimes(1)
            expect(ret).toBeInstanceOf(Array)
        })
    })

    describe('batchProcess', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        const getWeekSpy = jest.spyOn(Utils, 'getWeek').mockReturnValue(1)
        let getDataSpy = jest.spyOn(Utils, 'getData').mockReturnValue({
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
        })
        const updateLotterySpy = jest.spyOn(Repositories.lotteryRepository, 'updateLottery').mockReturnValue(true)
        const mailSenderSpy = jest.spyOn(MailSender, 'sendMailTo').mockReturnValue(true)
        const pushManagerSpy = jest.spyOn(PushManager, 'send').mockReturnValue(true)

        test('nothing to process', async () => {
            const getBatchTargetListSpy = jest.spyOn(Repositories.lotteryRepository, 'getBatchTargetList').mockReturnValue([])
            await lotteryService.batchProcess()
            expect(getWeekSpy).toHaveBeenCalledTimes(1)
            expect(getBatchTargetListSpy).toHaveBeenCalledTimes(1)

            expect(getDataSpy).toHaveBeenCalledTimes(0)
            expect(updateLotterySpy).toHaveBeenCalledTimes(0)
            expect(mailSenderSpy).toHaveBeenCalledTimes(0)
            expect(pushManagerSpy).toHaveBeenCalledTimes(0)
        })

        test('no one won', async () => {
            const getBatchTargetListSpy = jest.spyOn(Repositories.lotteryRepository, 'getBatchTargetList').mockReturnValue([
                {
                    id: 1,
                    userId: 45,
                    roundNo: 1,
                    numberCSV: '2,3,9,18,31,40',
                    correctCSV: '',
                    bonusNo: '',
                    rank: '',
                    isProcessed: 0,
                    name: 'sayho1',
                    email: 'sayho1@sayho.com',
                },
                {
                    id: 2,
                    userId: 45,
                    roundNo: 1,
                    numberCSV: '1,7,15,19,31,35',
                    correctCSV: '',
                    bonusNo: '',
                    rank: '',
                    isProcessed: 0,
                    name: 'sayho1',
                    email: 'sayho1@sayho.com',
                },
            ])

            await lotteryService.batchProcess()
            expect(getWeekSpy).toHaveBeenCalledTimes(1)
            expect(getBatchTargetListSpy).toHaveBeenCalledTimes(1)
            expect(getDataSpy).toHaveBeenCalledTimes(1)

            expect(updateLotterySpy).toHaveBeenCalledTimes(2)
            expect(mailSenderSpy).toHaveBeenCalledTimes(0)
            expect(pushManagerSpy).toHaveBeenCalledTimes(0)
        })

        test('1won - 1st', async () => {
            const getBatchTargetListSpy = jest.spyOn(Repositories.lotteryRepository, 'getBatchTargetList').mockReturnValue([
                {
                    id: 1,
                    userId: 45,
                    roundNo: 1,
                    numberCSV: '2,3,9,18,31,40',
                    correctCSV: '',
                    bonusNo: '',
                    rank: '',
                    isProcessed: 0,
                    name: 'sayho1',
                    email: 'sayho1@sayho.com',
                },
                {
                    id: 2,
                    userId: 45,
                    roundNo: 1,
                    numberCSV: '10,23,29,33,37,40',
                    correctCSV: '',
                    bonusNo: '',
                    rank: '',
                    isProcessed: 0,
                    name: 'sayho1',
                    email: 'sayho1@sayho.com',
                },
            ])

            await lotteryService.batchProcess()
            expect(getWeekSpy).toHaveBeenCalledTimes(1)
            expect(getBatchTargetListSpy).toHaveBeenCalledTimes(1)
            expect(getDataSpy).toHaveBeenCalledTimes(1)

            expect(updateLotterySpy).toHaveBeenCalledTimes(2)
            expect(mailSenderSpy).toHaveBeenCalledTimes(1)
            expect(pushManagerSpy).toHaveBeenCalledTimes(1)

            expect(pushManagerSpy).toHaveBeenCalledWith(
                [
                    'es-ktlZ-X_spC7thRilymu:APA91bGU1Q457wILfaaGjsX66wbGkKcEdKjYG2rmofuZIFhS7knQrML_dIumThY5CyXlxyKu7lf1xh74SunZ709GKQY_CNWiHjr1t-vq5drPVwiSISqOpjjtLvGbWKpD1wfYFwE4x_6q',
                ],
                `1회 당첨자 발표입니다.`,
                '1등 당첨을 축하합니다!'
            )
        })

        test('draw delayed (api with current week returns failed)', async () => {
            getDataSpy = jest
                .spyOn(Utils, 'getData')
                .mockReturnValueOnce({
                    returnValue: 'fail',
                })
                .mockReturnValueOnce({
                    totSellamnt: 3681782000,
                    returnValue: 'success',
                    drwNoDate: '2002-12-07',
                    firstWinamnt: 0,
                    firstPrzwnerCo: 0,
                    firstAccumamnt: 863604600,
                    drwNo: 0,
                    drwtNo1: 10,
                    drwtNo2: 23,
                    drwtNo3: 29,
                    drwtNo4: 33,
                    drwtNo5: 37,
                    drwtNo6: 40,
                    bnusNo: 16,
                })

            const getBatchTargetListSpy = jest.spyOn(Repositories.lotteryRepository, 'getBatchTargetList').mockReturnValue([
                {
                    id: 1,
                    userId: 45,
                    roundNo: 1,
                    numberCSV: '2,3,9,18,31,40',
                    correctCSV: '',
                    bonusNo: '',
                    rank: '',
                    isProcessed: 0,
                    name: 'sayho1',
                    email: 'sayho1@sayho.com',
                },
                {
                    id: 2,
                    userId: 45,
                    roundNo: 0,
                    numberCSV: '1,2,3,4,31,35',
                    correctCSV: '',
                    bonusNo: '',
                    rank: '',
                    isProcessed: 0,
                    name: 'sayho1',
                    email: 'sayho1@sayho.com',
                },
            ])

            await lotteryService.batchProcess()
            expect(getWeekSpy).toHaveBeenCalledTimes(1)
            expect(getBatchTargetListSpy).toHaveBeenCalledTimes(1)
            expect(getDataSpy).toHaveBeenCalledTimes(2)

            expect(updateLotterySpy).toHaveBeenCalledTimes(2)
            expect(mailSenderSpy).toHaveBeenCalledTimes(0)
            expect(pushManagerSpy).toHaveBeenCalledTimes(0)
        })
    })
})
