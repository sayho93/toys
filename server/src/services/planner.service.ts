import {Utils} from '#types/utils'
import PushManager = Utils.PushManager
import ErrorHandler = Utils.ErrorHandler
import PlannerRepository = Repositories.PlannerRepository
import UserRepository = Repositories.UserRepository
import PlannerService = Services.PlannerService

export const makePlannerService = (
    PlannerRepository: PlannerRepository,
    UserRepository: UserRepository,
    ErrorHandler: ErrorHandler,
    PushManager: PushManager
): PlannerService => {
    const getPlanners = async () => {
        return await PlannerRepository.getPlannerList()
    }

    const savePlanner = async (params: DTO.PlannerDTO) => {
        if (!params.userId) throw ErrorHandler.BaseError('UserId is required', 400)

        const reqUser = await UserRepository.getUserById(params.userId)
        const insertId = await PlannerRepository.savePlanner(params)
        if (!reqUser.length || !insertId) throw ErrorHandler.BaseError('User not found', 404)

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

    const deletePlanner = async (id: number) => {
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
