import Log from '#utils/logger'

const LotteryService = ({Repositories, Utils, MailSender, PushManager}) => {
    const saveLottery = async (userId, params) => {
        return await Repositories.lotteryRepository.addLottery({userId, roundNo: params.roundNo, numberCSV: params.numList})
    }

    const getLotteryList = async (userId = null, searchTxt = '', page = 1, limit = 10) => {
        return await Repositories.lotteryRepository.getLotteryList(userId, searchTxt, page, limit)
    }

    const getFameList = async (searchTxt = '', page = 1, limit = 10) => {
        return await Repositories.lotteryRepository.getLotteryFameList(searchTxt, page, limit)
    }

    const batchProcess = async () => {
        const week = Utils.getWeek()
        const list = await Repositories.lotteryRepository.getBatchTargetList(week)
        Log.debug(` batchProcess: ${list.length} items`)
        Log.debug(JSON.stringify(list))
        if (!list.length) return

        const winnerList = []
        const skipList = []
        let lotteryRes = await Utils.getData(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${list[0].roundNo}`)
        Log.debug(JSON.stringify(lotteryRes))

        for (let item of list) {
            if (skipList.includes(item.roundNo)) continue

            if (item.roundNo !== lotteryRes.drwNo) {
                lotteryRes = await Utils.getData(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${item.roundNo}`)
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
                if (set.has(+num)) corrects.push(num)
            })

            let rank = 0
            if (corrects.length === 6) rank = 1
            else if (corrects.length === 5) rank = nums.includes(lotteryRes.bnusNo.toString()) ? 2 : 3
            else if (corrects.length === 4) rank = 4
            else if (corrects.length === 3) rank = 5

            if (rank !== 0) winnerList.push({userId: item.userId, name: item.name, email: item.email, roundNo: item.roundNo, rank})

            await Repositories.lotteryRepository.updateLottery({id: item.id, correctCSV: corrects.join(','), bonusNo: lotteryRes.bnusNo, rank: rank})
        }

        Log.debug(` winnerList: ${winnerList.length} items`)

        for (let user of winnerList) {
            const template = `
                <p>${user.roundNo}회차</p>
                <p>${user.rank}등 당첨을 축하합니다!</p>
            `
            await MailSender.sendMailTo('LotGen 당첨 안내 메일', '', {name: user.name, addr: user.email}, template)

            const pushTarget = await Repositories.userRepository.getUserById(user.userId)
            const message = `${user.rank}등 당첨을 축하합니다!`
            const registrationKey = [pushTarget[0].pushToken]

            Log.debug(`Push target: ${JSON.stringify(pushTarget)}`)
            Log.debug(`registrationKey: ${registrationKey}`)

            await PushManager.send(registrationKey, `${week}회 당첨자 발표입니다.`, message)
        }
    }

    const notify = async () => {
        const users = await Repositories.userRepository.getUserHavingToken()
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
