/**
 * Module dependencies.
 */
import Config from '#configs/config'
import RequestBatch from '#src/loaders/requestBatch'
/**
 * Datasource
 */
import MariaDBDatasource from '#src/loaders/datasources/mariaDB.datasource'
import MongoDBDatasource from '#src/loaders/datasources/mongoDB.datasource'
import RedisDatasource from '#src/loaders/datasources/redis.datasource'
/**
 * Models
 */
import mongoose from 'mongoose'
import RoomModel from '#models/room.model'
import MessageModel from '#models/message.model'
/*
 * repositories
 */
import LotteryRepository from '#repositories/lottery.repository'
import UserRepository from '#repositories/user.repository'
import FileRepository from '#repositories/file.repository'
import ArticleRepository from '#repositories/article.repository'
import PlannerRepository from '#repositories/planner.repository'
import ChatRepository from '#repositories/chat.repository'
/*
 * Services
 */
import UserService from '#services/user.service'
import LotteryService from '#services/lottery.service'
import FileService from '#services/file.service'
import PlannerService from '#services/planner.service'
import ArticleService from '#services/article.service'
import ChatService from '#services/chat.service'
/*
 * Controllers
 */
import UserController from '#controllers/user.controller'
import FileController from '#controllers/file.controller'
import LotteryController from '#controllers/lottery.controller'
import PlannerController from '#controllers/planner.controller'
import ArticleController from '#controllers/article.controller'
import ChatController from '#controllers/chat.controller'
/*
 * Utils
 */
import {FileUtil} from '#utils/file.util'
import MailSender from '#utils/MailSender'
import PushManager from '#utils/PushManager'
import {encryptSHA, getData, getWeek} from '#utils/common.util'
import {AverageJob} from '#src/jobs/average.job'

export const requestBatch = RequestBatch()

const dataSourceMariaDB = MariaDBDatasource(Config.datasource.mariaDB)
MongoDBDatasource(mongoose, Config.datasource.mongoDB)

export const redisClient = RedisDatasource(Config.datasource.redis)

export const Datasources = {
    mariaDB: dataSourceMariaDB,
    redisClient: redisClient,
}

export const Models = {
    types: mongoose.Types,
    room: RoomModel(mongoose),
    message: MessageModel(mongoose),
}

export const Repositories = {
    lotteryRepository: LotteryRepository(dataSourceMariaDB),
    userRepository: UserRepository(dataSourceMariaDB),
    fileRepository: FileRepository(dataSourceMariaDB),
    articleRepository: ArticleRepository(dataSourceMariaDB),
    plannerRepository: PlannerRepository(dataSourceMariaDB),
    chatRepository: ChatRepository({Models}),
}

export const Services = {
    fileService: FileService({
        Repositories: {
            fileRepository: Repositories.fileRepository,
        },
        Utils: {encryptSHA},
        FileUtil: FileUtil,
    }),

    userService: UserService({
        Repositories: {
            userRepository: Repositories.userRepository,
            plannerRepository: Repositories.plannerRepository,
        },
        Utils: {encryptSHA},
        MailSender,
        PushManager,
        Workers: {AverageJob},
    }),

    lotteryService: LotteryService({
        Repositories: {
            lotteryRepository: Repositories.lotteryRepository,
            userRepository: Repositories.userRepository,
        },
        Utils: {getWeek, getData},
        MailSender,
        PushManager,
    }),

    plannerService: PlannerService({
        Repositories: {
            plannerRepository: Repositories.plannerRepository,
            userRepository: Repositories.userRepository,
        },
        PushManager,
    }),

    articleService: ArticleService({Repositories}),

    chatService: ChatService({Repositories}),
}

export const Controllers = {
    userController: UserController(Services.userService),
    lotteryController: LotteryController(Services.lotteryService, requestBatch),
    fileController: FileController(Services.fileService),
    plannerController: PlannerController(Services.plannerService, requestBatch),
    articleController: ArticleController(Services.articleService),
    chatController: ChatController(Services.chatService),
}
