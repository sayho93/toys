import {Request, Response} from 'express'

namespace Controllers {
    type controllerFunc = (req: Request, res: Response) => Promise<void>

    export interface UserController {
        signup: controllerFunc
        auth: controllerFunc
        login: controllerFunc
        getUser: controllerFunc
        updateToken: controllerFunc
        setUserNotified: controllerFunc
        testEmail: controllerFunc
        testPush: controllerFunc
        workerTest: controllerFunc
    }

    export interface LotteryController {
        saveLottery: controllerFunc
        getLotteries: controllerFunc
        fame: controllerFunc
        batchTest: controllerFunc
    }

    export interface PlannerController {
        getPlanners: controllerFunc
        savePlanner: controllerFunc
        deletePlanner: controllerFunc
        getLatestPlanner: controllerFunc
    }

    export interface FileController {
        uploadSingleFile: controllerFunc
        removeSingleFile: controllerFunc
        downloadSingleFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>
    }

    export interface LinkController {
        generateShortLink: controllerFunc
        getShortLink: controllerFunc
        redirectShortLink: controllerFunc
    }

    export interface PhotoController {
        addPhoto: controllerFunc
        getPhotos: controllerFunc
        getPhoto: controllerFunc
        removePhoto: controllerFunc
    }
}
