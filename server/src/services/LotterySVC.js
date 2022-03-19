class LotterySVC {
    constructor({Config, Utils, Mappers, Log, MailSender, PushManager}) {
        this.Config = Config
        this.Mappers = Mappers
        this.Utils = Utils
        this.Log = Log
        this.MailSender = MailSender
        this.PushManager = PushManager
    }

    async saveLottery(userId, params) {
        return await this.Mappers.lotteryMapper.addLottery({userId, roundNo: params.roundNo, numberCSV: params.numList})
    }

    async getLotteryList(userId = null, searchTxt = '', page = 1, limit = 10) {
        return await this.Mappers.lotteryMapper.getLotteryList(userId, searchTxt, page, limit)
    }

    async getFameList(searchTxt = '', page = 1, limit = 10) {
        return await this.Mappers.lotteryMapper.getLotteryFameList(searchTxt, page, limit)
    }

    async batchProcess() {
        const week = this.Utils.getWeek()
        const list = await this.Mappers.lotteryMapper.getBatchTargetList(week)
        this.Log.debug(` batchProcess: ${list.length}`)
        this.Log.debug(JSON.stringify(list))
        const winnerList = []
        if (list.length) {
            const skipList = []
            let lotteryRes = await this.Utils.getData(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${list[0].roundNo}`)
            this.Log.debug(JSON.stringify(lotteryRes))
            for (let item of list) {
                if (skipList.includes(item.roundNo)) continue
                if (item.roundNo !== lotteryRes.drwNo) {
                    lotteryRes = await this.Utils.getData(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${item.roundNo}`)
                    this.Log.debug(JSON.stringify(lotteryRes))
                    if (lotteryRes.returnValue === 'fail') {
                        this.Log.verbose(`skip ${item.roundNo}`)
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
                await this.Mappers.lotteryMapper.updateLottery({id: item.id, correctCSV: corrects.join(','), bonusNo: lotteryRes.bnusNo, rank: rank})
            }
        }

        for (let user of winnerList) {
            const template = `
                <p>${user.roundNo}회차</p>
                <p>${user.rank}등 당첨을 축하합니다!</p>
            `
            await this.MailSender.sendMailTo('LotGen 당첨 안내 메일', '', {name: user.name, addr: user.email}, template)

            const pushTarget = await this.Mappers.userMapper.getUserById(user.userId)
            this.Log.debug(pushTarget)
            const message = `${user.rank}등 당첨을 축하합니다!`
            const registrationKey = [pushTarget[0].pushToken]
            this.Log.debug(registrationKey)
            await this.PushManager.send(registrationKey, `${week}회 당첨자 발표입니다.`, message)
        }
    }

    async notify() {
        this.Log.debug('notify batch process ::::: ')
        const users = await this.Mappers.userMapper.getUserHavingToken()
        this.Log.debug(users)
        const registrationKey = users.map(user => user.pushToken)
        await this.PushManager.send(registrationKey, 'LotGen 알림', `곧 ${this.Utils.getWeek()} 추첨이 시작됩니다.`)
    }
}

export default LotterySVC

//functional way
// const LotterySVC = ({Models, MailSender, PushManager, Utils, Config, Log}) => {
//     const saveLottery = async (userId, params) => {
//         const res = await Models.lotteryModel.create({userId: userId, roundNo: params.roundNo, numberCSV: params.numList.join(',')})
//         return res.id
//     }
//
//     const getLotteryList = async (userId = null) => {
//         let query = `
//             SELECT lottery.*, user.name AS userName, user.email AS userEmail, user.status AS userStatus
//             FROM lottery JOIN user ON user.id = lottery.userId
//             WHERE ${userId ? 'lottery.userId = :userId' : '1=1'}
//             ORDER BY lottery.regDate DESC
//         `
//         return await Models.sequelize.query(query, {
//             replacements: {userId: userId},
//             type: QueryTypes.SELECT,
//         })
//     }
//
//     return [saveLottery, getLotteryList]
// }
//
// export default LotterySVC
