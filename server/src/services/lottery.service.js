import Log from '#utils/logger'
import Config from '#configs/config'

const LotteryService = ({LotteryRepository, UserRepository, Utils, MailSender, PushManager}) => {
    const saveLottery = async (userId, params) => {
        return await LotteryRepository.addLottery({userId, roundNo: params.roundNo, numberCSV: params.numList})
    }

    const getLotteryList = async (userId = null, searchTxt = '', page = 1, limit = 10) => {
        const wait = timeToDelay => new Promise(resolve => setTimeout(resolve, timeToDelay))
        await wait(2000)
        return await LotteryRepository.getLotteryList(userId, searchTxt, page, limit)
    }

    const getFameList = async (searchTxt = '', page = 1, limit = 10) => {
        return await LotteryRepository.getLotteryFameList(searchTxt, page, limit)
    }

    const batchProcess = async () => {
        Log.verbose('batchProcess start')
        const week = Utils.getWeek()
        const list = await LotteryRepository.getBatchTargetList(week)
        Log.debug(`${list.length} items`)
        Log.debug(JSON.stringify(list))
        if (!list.length) return

        const winnerList = []
        const skipList = []
        let lotteryRes = await Utils.getData(`${Config.app.externalApi.LOTTERY_CHECK}${list[0].roundNo}`)
        Log.debug(JSON.stringify(lotteryRes))

        const updateJobs = []

        for (let item of list) {
            if (skipList.includes(item.roundNo)) continue

            if (item.roundNo !== lotteryRes.drwNo) {
                lotteryRes = await Utils.getData(`${Config.app.externalApi.LOTTERY_CHECK}${item.roundNo}`)
                Log.debug(JSON.stringify(lotteryRes))
                if (lotteryRes.returnValue === 'fail') {
                    Log.verbose(`skip ${item.roundNo}`)
                    skipList.push(item.roundNo)
                    continue
                }
            }

            const corrects = []
            const nums = item.numberCSV.split(',')
            const set = new Set()
            for (let i = 1; i <= 6; i++) set.add(lotteryRes[`drwtNo${i}`])
            nums.forEach(num => {
                if (set.has(+num)) corrects.push(+num)
            })

            let rank = 0
            if (corrects.length === 6) rank = 1
            else if (corrects.length === 5) rank = nums.includes(lotteryRes.bnusNo) ? 2 : 3
            else if (corrects.length === 4) rank = 4
            else if (corrects.length === 3) rank = 5

            if (rank !== 0) winnerList.push({userId: item.userId, name: item.name, email: item.email, roundNo: item.roundNo, rank})

            updateJobs.push(async () => await LotteryRepository.updateLottery({id: item.id, correctCSV: corrects.join(','), bonusNo: lotteryRes.bnusNo, rank: rank}))
            // await Repositories.LotteryRepository.updateLottery({id: item.id, correctCSV: corrects.join(','), bonusNo: lotteryRes.bnusNo, rank: rank})
        }

        await Promise.all(updateJobs.map(job => job()))

        Log.debug(` winnerList: ${winnerList.length} items`)
        const jobs = []

        for (let user of winnerList) {
            const template = `<p>---${user.roundNo}회차---</p><p>${user.rank}등 당첨을 축하합니다!</p>`
            jobs.push(() => MailSender.sendMailTo('LotGen 당첨 안내 메일', '', {name: user.name, addr: user.email}, template))

            const pushTarget = await UserRepository.getUserById(user.userId)
            const message = `${user.rank}등 당첨을 축하합니다!`
            const registrationKey = [pushTarget[0].pushToken]

            Log.debug(`Push target: ${JSON.stringify(pushTarget)}`)
            Log.debug(`registrationKey: ${registrationKey}`)
            jobs.push(() => PushManager.send(registrationKey, `${week}회 당첨자 발표입니다.`, message))
        }

        await Promise.all(jobs.map(job => job()))
        Log.verbose('batchProcess done')
    }

    const notify = async () => {
        const users = await UserRepository.getUserHavingToken()
        Log.debug(`notify batch process: ${users.length} items`)
        const registrationKey = users.map(user => user.pushToken)
        await PushManager.send(registrationKey, 'LotGen 알림', `곧 ${Utils.getWeek()}회 추첨이 시작됩니다.`)
    }

    return {
        saveLottery,
        getLotteryList,
        getFameList,
        batchProcess,
        notify,
    }
}

export default LotteryService
