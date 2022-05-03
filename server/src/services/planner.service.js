const PlannerService = ({PlannerRepository, UserRepository, PushManager}) => {
    const getPlanners = async () => {
        return await PlannerRepository.getPlannerList()
    }

    const savePlanner = async params => {
        const reqUser = await UserRepository.getUserById(params.userId)
        const insertId = await PlannerRepository.savePlanner(params)
        if (!reqUser.length || !insertId) return null

        if (!params.id) {
            const users = await UserRepository.getUserHavingToken()
            await PushManager.send(
                users.map(user => user.pushToken),
                'Planner 알림',
                `${reqUser[0].name}님이 새로운 계획을 추가했습니다.`
            )
        }
        return insertId
    }

    const deletePlanner = async id => {
        return await PlannerRepository.deletePlanner(id)
    }

    const getLatest = async () => {
        return await PlannerRepository.getLatestPlanner()
    }

    return {
        getPlanners,
        savePlanner,
        deletePlanner,
        getLatest,
    }
}

export default PlannerService
