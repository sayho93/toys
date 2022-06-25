import Config from '#configs/config'

import {makeMariaDBDatasource} from '#datasources/mariaDB.datasource'
import {makeMongoDBDatasource} from '#datasources/mongoDB.datasource'
import {makeRedisDatasource} from '#datasources/redis.datasource'

import {makeUserRepository} from '#repositories/user.repository'
import {makeLotteryRepository} from '#repositories/lottery.repository'
import {makePlannerRepository} from '#repositories/planner.repository'
import {makeFileRepository} from '#repositories/file.repository'
import {makeLinkRepository} from '#repositories/link.repository'

import {makeUserService} from '#services/user.service'
import {makeLotteryService} from '#services/lottery.service'
import {makePlannerService} from '#services/planner.service'
import {makeFileService} from '#services/file.service'
import {makeLinkService} from '#services/link.service'

import {makeLinkController} from '#controllers/link.controller'
import {makeLotteryController} from '#controllers/lottery.controller'
import {makeUserController} from '#controllers/user.controller'
import {makePlannerController} from '#controllers/planner.controller'
import {makeFileController} from '#controllers/file.controller'
import {makePhotoRepository} from '#repositories/photo.repository'

import LotteryJob from '#jobs/schedulers/lottery.job'
import {AverageJob} from '#jobs/workers/average.job'

import MailSender from '#utils/mailSender'
import PushManager from '#utils/pushManager'
import EncryptUtil from '#utils/encrypt.util'
import FileUtil from '#utils/file.util'
import ErrorHandlerUtil from '#utils/errorHandler.util'
import DateUtil from '#utils/date.util'
import HttpUtil from '#utils/http.util'
import Log from '#utils/logger'
import RequestBatcher from '#utils/requestBatcher'
import {makePhotoService} from '#services/photo.service'
import {makePhotoController} from '#controllers/photo.controller'

const mariaDBDatasource = makeMariaDBDatasource(Config.datasource.mariaDB, ErrorHandlerUtil)
const mongoDBDatasource = makeMongoDBDatasource(Config.datasource.mongoDB)
const redisDatasource = makeRedisDatasource(Config.datasource.redis)

const userRepository = makeUserRepository(mariaDBDatasource)
const lotteryRepository = makeLotteryRepository(mariaDBDatasource)
const plannerRepository = makePlannerRepository(mariaDBDatasource)
const fileRepository = makeFileRepository(mariaDBDatasource)
const linkRepository = makeLinkRepository(mariaDBDatasource)
const photoRepository = makePhotoRepository(mariaDBDatasource)

const userService = makeUserService(userRepository, plannerRepository, ErrorHandlerUtil, MailSender, PushManager, EncryptUtil, Config.app.AUTH_URI, AverageJob)
const lotteryService = makeLotteryService(lotteryRepository, userRepository, MailSender, PushManager, DateUtil, HttpUtil, Log, Config.app.externalApi.LOTTERY_CHECK)
const plannerService = makePlannerService(plannerRepository, userRepository, ErrorHandlerUtil, PushManager)
const fileService = makeFileService(fileRepository, ErrorHandlerUtil, FileUtil, Config.app.EXTERNAL_PATH)
const linkService = makeLinkService(linkRepository, ErrorHandlerUtil, EncryptUtil)
const photoService = makePhotoService(photoRepository, ErrorHandlerUtil)

const userController = makeUserController(userService, ErrorHandlerUtil)
const lotteryController = makeLotteryController(lotteryService, redisDatasource, ErrorHandlerUtil, RequestBatcher)
const plannerController = makePlannerController(plannerService, redisDatasource, ErrorHandlerUtil, RequestBatcher)
const fileController = makeFileController(fileService, ErrorHandlerUtil, Log)
const linkController = makeLinkController(linkService, ErrorHandlerUtil)
const photoController = makePhotoController(photoService, ErrorHandlerUtil, Log)

const lotteryJob = LotteryJob(lotteryService, redisDatasource)

// import {Container} from 'inversify'
// import {Utils} from '#types/utils'
// import {Datasources} from '#types/datasources'
// import MariaDBConf = Configs.MariaDBConf
// import MongoDBConf = Configs.MongoDBConf
// import RedisConf = Configs.RedisConf
//
// const TYPES = {
//     Config: Symbol.for('Config'),
//     MariaDBConf: Symbol.for('MariaDBConf'),
//     MongoDBConf: Symbol.for('MongoDBConf'),
//     RedisConf: Symbol.for('RedisConf'),
//
//     UserController: Symbol.for('UserController'),
//     LotteryController: Symbol.for('LotteryController'),
//     PlannerController: Symbol.for('PlannerController'),
//     FileController: Symbol.for('FileController'),
//     LinkController: Symbol.for('LinkController'),
//
//     UserService: Symbol.for('UserService'),
//     LotteryService: Symbol.for('LotteryService'),
//     PlannerService: Symbol.for('PlannerService'),
//     FileService: Symbol.for('FileService'),
//     LinkService: Symbol.for('LinkService'),
//
//     UserRepository: Symbol.for('UserRepository'),
//     LotteryRepository: Symbol.for('LotteryRepository'),
//     PlannerRepository: Symbol.for('PlannerRepository'),
//     FileRepository: Symbol.for('FileRepository'),
//     LinkRepository: Symbol.for('LinkRepository'),
//
//     MariaDBDatasource: Symbol.for('MariaDBDatasource'),
//     MongoDBDatasource: Symbol.for('MongoDBDatasource'),
//     RedisDatasource: Symbol.for('RedisDatasource'),
//
//     AverageJob: Symbol.for('AverageJob'),
//     LotteryJob: Symbol.for('LotteryJob'),
//
//     MailSender: Symbol.for('MailSender'),
//     PushManager: Symbol.for('PushManager'),
//     EncryptUtil: Symbol.for('EncryptUtil'),
//     DateUtil: Symbol.for('DateUtil'),
//     HttpUtil: Symbol.for('HttpUtil'),
//     ErrorHandlerUtil: Symbol.for('ErrorHandlerUtil'),
//     FileUtil: Symbol.for('FileUtil'),
//     Log: Symbol.for('Log'),
//     RequestBatcher: Symbol.for('RequestBatcher'),
// }

// function bindDependencies(func: any, dependencies: symbol[]) {
//     let injections = dependencies.map(dependency => {
//         return container.get(dependency)
//     })
//     return func(...injections)
//     // return func.bind(func, ...injections)
// }

// const container = new Container()
// container.bind(TYPES.Config).toConstantValue(Config)
// container.bind<MariaDBConf>(TYPES.MariaDBConf).toConstantValue(Config.datasource.mariaDB)
// container.bind<MongoDBConf>(TYPES.MongoDBConf).toConstantValue(Config.datasource.mongoDB)
// container.bind<RedisConf>(TYPES.RedisConf).toConstantValue(Config.datasource.redis)
//
// container.bind<Utils.MailSender>(TYPES.MailSender).toConstantValue(MailSender)
// container.bind<Utils.PushManager>(TYPES.PushManager).toConstantValue(PushManager)
// container.bind<Utils.Encryptor>(TYPES.EncryptUtil).toConstantValue(EncryptUtil)
// container.bind<Utils.DateUtil>(TYPES.DateUtil).toConstantValue(DateUtil)
// container.bind<Utils.HttpUtil>(TYPES.HttpUtil).toConstantValue(HttpUtil)
// container.bind<Utils.ErrorHandler>(TYPES.ErrorHandlerUtil).toConstantValue(ErrorHandlerUtil)
// container.bind<Utils.File>(TYPES.FileUtil).toConstantValue(FileUtil)
// container.bind<Utils.Log>(TYPES.Log).toConstantValue(Log)
// container.bind<Utils.RequestBatcher>(TYPES.RequestBatcher).toConstantValue(RequestBatcher)
//
// container.bind<Datasources.IMariaDBDataSource>(TYPES.MariaDBDatasource).toConstantValue(bindDependencies(makeMariaDBDatasource, [TYPES.MariaDBConf]))
// container.bind<Datasources.IMongoDBDataSource>(TYPES.MongoDBDatasource).toConstantValue(bindDependencies(makeMongoDBDatasource, [TYPES.MongoDBConf]))
// container.bind<Datasources.IRedisDataSource>(TYPES.RedisDatasource).toConstantValue(bindDependencies(makeRedisDatasource, [TYPES.RedisConf]))
//
// container.bind(TYPES.UserRepository).toConstantValue(bindDependencies(makeUserRepository, [TYPES.MariaDBDatasource]))
// container.bind(TYPES.LotteryRepository).toConstantValue(bindDependencies(makeLotteryRepository, [TYPES.MariaDBDatasource]))
// container.bind(TYPES.PlannerRepository).toConstantValue(bindDependencies(makePlannerRepository, [TYPES.MariaDBDatasource]))
// container.bind(TYPES.FileRepository).toConstantValue(bindDependencies(makeFileRepository, [TYPES.MariaDBDatasource]))
// container.bind(TYPES.LinkRepository).toConstantValue(bindDependencies(makeLinkRepository, [TYPES.MariaDBDatasource]))
//
// container.bind(TYPES.UserService).toConstantValue(bindDependencies(makeUserService, [TYPES.UserRepository]))
//
// container.bind(TYPES.LotteryController).toConstantValue(makeLotteryController)
// container.bind(TYPES.PlannerController).toConstantValue(makePlannerController)
// container.bind(TYPES.FileController).toConstantValue(makeFileController)
// container.bind(TYPES.LinkController).toConstantValue(makeLinkController)
//
// const mailSender: Utils.MailSender = container.get(TYPES.MailSender)
// console.log(await mailSender.sendMailTo('test', 'aaaaaa', {name: 'sayho', addr: 'fishcreek@naver.com'}))
//
// const userRepository = container.get<Repositories.IUserRepository>(TYPES.UserRepository)
// console.log(userRepository.toString())
// console.log(await userRepository.getUserById(45))

export default {
    mariaDBDatasource,
    mongoDBDatasource,
    redisDatasource,

    userRepository,
    lotteryRepository,
    plannerRepository,
    fileRepository,
    linkRepository,
    photoRepository,

    userService,
    lotteryService,
    plannerService,
    fileService,
    linkService,
    photoService,

    userController,
    lotteryController,
    plannerController,
    fileController,
    linkController,
    photoController,

    lotteryJob,
}
