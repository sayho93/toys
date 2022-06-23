namespace Repositories {
    export interface LinkRepository {
        addLinkBase: (url: string) => Promise<number>
        modLink: (id: number, shortId: string) => Promise<number>
        getLink: (id: number) => Promise<DTO.LinkDTO | undefined>
    }

    export interface UserRepository {
        getUserById: (id: number) => Promise<any>
        getUserByEmail: (email: string) => Promise<any>
        checkLogin: (data: DTO.UserDTO) => Promise<any>
        updateUserStatus: (id: number, status: number) => Promise<number>
        addUser: (data: DTO.UserDTO) => Promise<number>
        addAuth: (userId: number, token: string) => Promise<number>
        deleteAuth: (userId: number) => Promise<number>
        searchAuth: (userId: number, token: string) => Promise<any>
        removeAuth: (userId: number) => Promise<number>
        updateToken: (userId: number, token: string) => Promise<number>
        getUserHavingToken: () => Promise<DTO.UserDTO[]>
        setUserNotified: (userId: number, id: number) => Promise<number>
    }

    export interface LotteryRepository {
        addLottery: (data: DTO.LotteryDTO) => Promise<number>
        getLotteryList: (data: DTO.LotteryDTO) => Promise<DTO.LotteryDTO[]>
        getLotteryFameList: (data: DTO.LotteryDTO) => Promise<DTO.LotteryDTO[]>
        getBatchTargetList: (week: number) => Promise<DTO.LotteryDTO[]>
        updateLottery: (data: DTO.LotteryDTO) => Promise<DTO.LotteryDTO[]>
    }

    export interface PlannerRepository {
        getLatestPlanner: () => Promise<DTO.PlannerDTO>
        getPlannerList: () => Promise<DTO.PlannerDTO[]>
        savePlanner: (data: DTO.PlannerDTO) => Promise<number>
        deletePlanner: (id: number) => Promise<number>
    }

    export interface FileRepository {
        addFile: (file: DTO.FileDTO) => Promise<number>
        getFile: (id: number) => Promise<DTO.FileDTO>
        removeFile: (id: number) => Promise<boolean>
    }

    export interface PhotoRepository {
        addPhoto: (photo: DTO.PhotoDTO) => Promise<number>
        getPhoto: (id: number) => Promise<DTO.PhotoDTO>
        getPhotos: (userId: DTO.PhotoDTO) => Promise<DTO.PhotoDTO[]>
        removePhoto: (id: number) => Promise<number>
    }
}
