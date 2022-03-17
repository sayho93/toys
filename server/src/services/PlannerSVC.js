class PlannerSVC {
    constructor({Config, Utils, Mappers, Log, MailSender, PushManager}) {
        this.Config = Config
        this.Mappers = Mappers
        this.Utils = Utils
        this.Log = Log
        this.MailSender = MailSender
        this.PushManager = PushManager
    }

    async getPlannerList(params = {}) {
        return await this.Mappers.plannerMapper.getPlannerList(params)
    }

    async savePlanner(params) {
        const reqUser = await this.Mappers.userMapper.getUserById(params.userId)
        const insertId = await this.Mappers.plannerMapper.savePlanner(params)
        if (!reqUser.length || !insertId) return null

        if (!params.id) {
            const users = await this.Mappers.userMapper.getUserHavingToken()
            await this.PushManager.send(
                users.map(user => user.pushToken),
                'Planner 알림',
                `${reqUser[0].name}님이 새로운 계획을 추가했습니다.`
            )
        }
        return insertId
    }

    async deletePlanner(id) {
        return await this.Mappers.plannerMapper.deletePlanner(id)
    }

    async getLatest() {
        return await this.Mappers.plannerMapper.getLatestPlanner()
    }
}

export default PlannerSVC
