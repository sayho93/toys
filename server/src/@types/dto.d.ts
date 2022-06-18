namespace DTO {
    export type FileDTO = {
        userId?: number
        originName: string
        name?: string
        path: string
        shortPath: string
        size: number
        width?: number
        height?: number
        ext: string
        desc?: string
    }

    export type LinkDTO = {
        id?: number
        shortId: string
        url: string
        createdAt: string
    }

    export type LotteryDTO = {
        id?: number
        userId?: number | undefined
        email?: string
        name?: string

        roundNo?: string
        numberCSV?: string
        correctCSV?: string
        bonusNo?: string
        rank?: number

        searchTxt?: string
        page?: number
        limit?: number
    }

    export type PlannerDTO = {
        id?: number
        userId?: number
        targetDate?: Date
        color?: string
        title?: string
        content?: string
        status?: number
        regDate?: Date
    }

    export type UserDTO = {
        id?: number
        email?: string
        password?: string
        name?: string
        pushToken: string
        status?: string
        lastPlannerId?: number
        regDate?: string
    }
}
