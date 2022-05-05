import Log from '#utils/logger'

const LotteryService = ({Config, LotteryRepository, UserRepository, DateUtil, HttpUtil, MailSender, PushManager}) => {
    const _updateLotteries = async list => {
        Log.debug(`${list.length} items`)
        Log.debug(JSON.stringify(list))

        const winners = []
        const skips = new Set()

        HttpUtil.use(HttpUtil.strategy.axios.get)
        let lotteryRes = await HttpUtil.fetch(`${Config.app.externalApi.LOTTERY_CHECK}${list[0].roundNo}`)
        Log.debug(JSON.stringify(lotteryRes))

        const updateJobs = []

        for (let item of list) {
            if (skips.has(item.roundNo)) continue

            if (item.roundNo !== lotteryRes.drwNo) {
                lotteryRes = await HttpUtil.fetch(`${Config.app.externalApi.LOTTERY_CHECK}${item.roundNo}`)
                Log.debug(JSON.stringify(lotteryRes))
            }

            if (lotteryRes.returnValue === 'fail') {
                Log.verbose(`skip ${item.roundNo}`)
                skips.set(item.roundNo)
                continue
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

            if (rank !== 0) winners.push({userId: item.userId, name: item.name, email: item.email, roundNo: item.roundNo, rank})

            updateJobs.push(async () => await LotteryRepository.updateLottery({id: item.id, correctCSV: corrects.join(','), bonusNo: lotteryRes.bnusNo, rank: rank}))
            // await Repositories.LotteryRepository.updateLottery({id: item.id, correctCSV: corrects.join(','), bonusNo: lotteryRes.bnusNo, rank: rank})
        }
        Log.debug(` winners: ${winners.length} items`)
        await Promise.all(updateJobs.map(job => job()))
        return winners
    }

    const _sendNotification = async (week, winners) => {
        const jobs = []

        for (let user of winners) {
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
    }

    const batchProcess = async () => {
        Log.verbose('batchProcess start')
        const week = DateUtil.getWeek()
        const list = await LotteryRepository.getBatchTargetList(week)
        if (!list.length) return

        const winners = await _updateLotteries(list)
        if (winners.length) await _sendNotification(week, winners)
        Log.verbose('batchProcess done')
    }

    const notify = async () => {
        const users = await UserRepository.getUserHavingToken()
        Log.debug(`notify batch process: ${users.length} items`)
        const registrationKey = users.map(user => user.pushToken)
        await PushManager.send(registrationKey, 'LotGen 알림', `곧 ${DateUtil.getWeek()}회 추첨이 시작됩니다.`)
    }

    return {
        saveLottery: async (userId, params) => {
            return await LotteryRepository.addLottery({userId, roundNo: params.roundNo, numberCSV: params.numList})
        },
        getLotteryList: async (userId = null, searchTxt = '', page = 1, limit = 10) => {
            const wait = timeToDelay => new Promise(resolve => setTimeout(resolve, timeToDelay))
            await wait(2000)
            return await LotteryRepository.getLotteryList(userId, searchTxt, page, limit)
        },
        getFameList: async (searchTxt = '', page = 1, limit = 10) => {
            return await LotteryRepository.getLotteryFameList(searchTxt, page, limit)
        },
        batchProcess,
        notify,
    }
}

export default LotteryService
