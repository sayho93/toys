const PlannerService = ({Repositories, PushManager}) => {
    const getPlanners = async () => {
        return await Repositories.plannerRepository.getPlannerList()
    }

    const savePlanner = async params => {
        const reqUser = await Repositories.userRepository.getUserById(params.userId)
        const insertId = await Repositories.plannerRepository.savePlanner(params)
        if (!reqUser.length || !insertId) return null

        if (!params.id) {
            const users = await Repositories.userRepository.getUserHavingToken()
            await PushManager.send(
                users.map(user => user.pushToken),
                'Planner 알림',
                `${reqUser[0].name}님이 새로운 계획을 추가했습니다.`
            )
        }
        return insertId
    }

    const deletePlanner = async id => {
        return await Repositories.plannerRepository.deletePlanner(id)
    }

    const getLatest = async () => {
        return await Repositories.plannerRepository.getLatestPlanner()
    }

    return {
        getPlanners,
        savePlanner,
        deletePlanner,
        getLatest,
    }
}

export default PlannerService
