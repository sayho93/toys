import {Utils} from '#types/utils'
import MailSender = Utils.MailSender
import PushManager = Utils.PushManager
import DateUtil = Utils.DateUtil
import HttpUtil = Utils.HttpUtil
import Log = Utils.Log
import LotteryRepository = Repositories.LotteryRepository
import UserRepository = Repositories.UserRepository
import LotteryService = Services.LotteryService

export const makeLotteryService = (
    LotteryRepository: LotteryRepository,
    UserRepository: UserRepository,
    MailSender: MailSender,
    PushManager: PushManager,
    DateUtil: DateUtil,
    HttpUtil: HttpUtil,
    Log: Log,
    LOTTERY_CHECK: string
): LotteryService => {
    const _updateLotteries = async (list: DTO.LotteryDTO[]) => {
        Log.debug(`${list.length} items`)
        Log.debug(JSON.stringify(list))

        const winners: DTO.LotteryDTO[] = []
        const skips = new Set()

        let lotteryRes = await HttpUtil.getData(`${LOTTERY_CHECK}${list[0].roundNo}`)
        Log.debug(JSON.stringify(lotteryRes))

        const updateJobs = []

        for (let item of list) {
            if (skips.has(item.roundNo)) continue

            if (item.roundNo !== lotteryRes.drwNo) {
                lotteryRes = await HttpUtil.getData(`${LOTTERY_CHECK}${item.roundNo}`)
                Log.debug(JSON.stringify(lotteryRes))
            }

            if (lotteryRes.returnValue === 'fail') {
                Log.verbose(`skip ${item.roundNo}`)
                skips.add(item.roundNo)
                continue
            }

            const corrects: number[] = []
            if (!item.numberCSV) continue
            const nums = item.numberCSV.split(',')
            const set = new Set()
            for (let i = 1; i <= 6; i++) set.add(lotteryRes[`drwtNo${i}`])
            nums.forEach((num: string) => {
                if (set.has(+num)) corrects.push(+num)
            })

            let rank = 0
            if (corrects.length === 6) rank = 1
            else if (corrects.length === 5) rank = nums.includes(lotteryRes.bnusNo) ? 2 : 3
            else if (corrects.length === 4) rank = 4
            else if (corrects.length === 3) rank = 5

            if (rank !== 0)
                winners.push({
                    userId: item.userId,
                    name: item.name,
                    email: item.email,
                    roundNo: item.roundNo,
                    rank,
                })

            updateJobs.push(
                async () =>
                    await LotteryRepository.updateLottery({
                        id: item.id,
                        correctCSV: corrects.join(','),
                        bonusNo: lotteryRes.bnusNo,
                        rank: rank,
                    })
            )
            // await Repositories.LotteryRepository.updateLottery({id: item.id, correctCSV: corrects.join(','), bonusNo: lotteryRes.bnusNo, rank: rank})
        }
        Log.debug(` winners: ${winners.length} items`)
        await Promise.all(updateJobs.map(job => job()))
        return winners
    }

    const _sendNotification = async (week: number, winners: DTO.LotteryDTO[]) => {
        const jobs = []

        for (let user of winners) {
            const template = `<p>---${user.roundNo}회차---</p><p>${user.rank}등 당첨을 축하합니다!</p>`
            jobs.push(() => MailSender.sendMailTo('LotGen 당첨 안내 메일', '', {name: user.name || '', addr: user.email || ''}, template))

            if (!user.userId) continue
            const pushTarget = await UserRepository.getUserById(user.userId)
            const message = `${user.rank}등 당첨을 축하합니다!`
            const registrationKey = [pushTarget[0].pushToken]

            Log.debug(`Push target: ${JSON.stringify(pushTarget)}`)
            Log.debug(`registrationKey: ${registrationKey}`)
            jobs.push(() => PushManager.send(registrationKey, `${week}회 당첨자 발표입니다.`, message))
        }

        await Promise.all(jobs.map(job => job()))
    }

    const batchProcess = async () => {
        Log.verbose('batchProcess start')
        const week = DateUtil.getWeek()
        const list: DTO.LotteryDTO[] = await LotteryRepository.getBatchTargetList(week)
        if (!list.length) return

        const winners = await _updateLotteries(list)
        if (winners.length) await _sendNotification(week, winners)
        Log.verbose('batchProcess done')
    }

    const notify = async () => {
        const users = await UserRepository.getUserHavingToken()
        Log.debug(`notify batch process: ${users.length} items`)
        if (!users.length) return
        const registrationKey: string[] = users.map((user: DTO.UserDTO) => user.pushToken)
        await PushManager.send(registrationKey, 'LotGen 알림', `곧 ${DateUtil.getWeek()}회 추첨이 시작됩니다.`)
    }

    return {
        saveLottery: async (userId: number, params: {roundNo: string; numList: string}) => {
            return await LotteryRepository.addLottery({userId, roundNo: params.roundNo, numberCSV: params.numList, limit: 0, page: 0})
        },
        getLotteryList: async (userId = undefined, searchTxt = '', page = 1, limit = 10) => {
            // const wait = timeToDelay => new Promise(resolve => setTimeout(resolve, timeToDelay))
            // await wait(2000)
            return await LotteryRepository.getLotteryList({
                userId,
                searchTxt,
                page,
                limit,
            })
        },
        getFameList: async (searchTxt = '', page = 1, limit = 10) => {
            return await LotteryRepository.getLotteryFameList({
                searchTxt,
                page,
                limit,
            })
        },
        batchProcess,
        notify,
    }
}
