namespace Services {
    export interface LinkService {
        generateShortLink: (url: string) => Promise<{data: DTO.LinkDTO}>
        getShortLink: (shortId: string) => Promise<DTO.LinkDTO>
    }

    export interface UserService {
        signUp: (email: string, name: string, password: string) => Promise<DTO.UserDTO>
        auth: (userId: number, token: string) => Promise<boolean>
        login: ({email, password}: {email: string; password: string}) => Promise<DTO.UserDTO>
        getUserById: (userId: number) => Promise<DTO.UserDTO>
        updateToken: (userId: number, token: string) => Promise<number>
        sendPushToAll: (message: string) => Promise<void>
        setUserNotified: (userId: number) => Promise<boolean>
        testEmail: (message: string) => Promise<void>
        testPush: (message: string) => Promise<void>
        workerTest: (num: number) => Promise<bigint>
    }

    export interface LotteryService {
        saveLottery: (userId: number, params: {roundNo: string; numList: string}) => Promise<number>
        getLotteryList: (userId: number | undefined, searchTxt: string, page: number, limit: number) => Promise<DTO.LotteryDTO[]>
        getFameList: (searchTxt: string, page: number, limit: number) => Promise<DTO.LotteryDTO[]>
        batchProcess: () => Promise<void>
        notify: () => Promise<void>
    }

    export interface PlannerService {
        getPlanners: () => Promise<DTO.PlannerDTO[]>
        savePlanner: (params: DTO.PlannerDTO) => Promise<number>
        deletePlanner: (id: number) => Promise<number>
        getLatest: () => Promise<DTO.PlannerDTO>
    }

    export interface FileService {
        processFile: (userId: number, file: Express.Multer.File, desc: string) => Promise<number>
        removeFile: (id: number) => Promise<boolean>
        getFile: (id: number) => Promise<DTO.FileDTO>
    }
}
