import {asFunction, asValue, createContainer, InjectionMode} from 'awilix'

import Config from '#configs/config'
/* Loaders */
import RequestBatch from '#src/loaders/requestBatch'
/* Datasources */
import RedisDatasource from '#datasources/redis.datasource'
import MariaDBDatasource from '#datasources/mariaDB.datasource'
import MongoDBDatasource from '#datasources/mongoDB.datasource'
/* Jobs */
import {AverageJob} from '#src/jobs/average.job'
import LotteryJob from '#src/jobs/lottery.job'
/* Models */
import RoomModel from '#models/room.model'
import MessageModel from '#models/message.model'
/* Repositories */
import ArticleRepository from '#repositories/article.repository'
import ChatRepository from '#repositories/chat.repository'
import UserRepository from '#repositories/user.repository'
import FileRepository from '#repositories/file.repository'
import PlannerRepository from '#repositories/planner.repository'
import LotteryRepository from '#repositories/lottery.repository'
/* Services */
import ArticleService from '#services/article.service'
import ChatService from '#services/chat.service'
import FileService from '#services/file.service'
import LotteryService from '#services/lottery.service'
import UserService from '#services/user.service'
import PlannerService from '#services/planner.service'
/* Controllers */
import ArticleController from '#controllers/article.controller'
import ChatController from '#controllers/chat.controller'
import FileController from '#controllers/file.controller'
import LotteryController from '#controllers/lottery.controller'
import PlannerController from '#controllers/planner.controller'
import UserController from '#controllers/user.controller'
/* Routes */
import ArticleRoute from '#routes/api/v1/article.route'
import ChatRoute from '#routes/api/v1/chat.route'
import FileRoute from '#routes/api/v1/file.route'
import LotteryRoute from '#routes/api/v1/lottery.route'
import PlannerRoute from '#routes/api/v1/planner.route'
import UserRoute from '#routes/api/v1/user.route'
/* Utils */
import Log from '#utils/logger'
import HttpUtil from '#utils/http.util'
import EncryptUtil from '#utils/encrypt.util'
import MailSender from '#utils/MailSender'
import PushManager from '#utils/PushManager'
import FileUtil from '#utils/file.util'
import ErrorHandlerUtil from '#utils/errorHandler.util'
import DateUtil from '#utils/date.util'

const Container = () => {
    const container = createContainer({
        injectionMode: InjectionMode.PROXY,
    })

    const _formatName = name => {
        const [fName, namespace] = name.split('.')
        const fNameFormatted = fName.charAt(0).toUpperCase() + fName.slice(1)
        const namespaceFormatted = namespace.charAt(0).toUpperCase() + namespace.slice(1)
        Log.debug(`${fNameFormatted}${namespaceFormatted} registered`)
        return `${fNameFormatted}${namespaceFormatted}`
    }

    const init = async () => {
        container.register({
            Config: asValue(Config),
            RequestBatch: asFunction(RequestBatch).singleton(),

            RedisClient: asFunction(RedisDatasource).singleton(),
            DataSourceMariaDB: asFunction(MariaDBDatasource).singleton(),
            DataSourceMongoDB: asFunction(MongoDBDatasource).singleton(),

            DateUtil: asValue(DateUtil),
            EncryptUtil: asValue(EncryptUtil),
            ErrorHandlerUtil: asValue(ErrorHandlerUtil),
            FileUtil: asValue(FileUtil),
            HttpUtil: asValue(HttpUtil),
            Log: asValue(Log),
            MailSender: asValue(MailSender),
            PushManager: asValue(PushManager),

            AverageJob: asValue(AverageJob),
            LotteryJob: asFunction(LotteryJob),
        })

        // await container.loadModules(['src/routes/api/v1/*.route.js', 'src/models/*.js', 'src/repositories/*.js', 'src/services/*.js', 'src/controllers/*.js'], {
        //     esModules: true,
        //     formatName,
        //     cwd: path.resolve(''),
        // })

        /* Dynamic import 사용시 jest error */
        container.register({
            MessageModel: asFunction(MessageModel),
            RoomModel: asFunction(RoomModel),

            ArticleRepository: asFunction(ArticleRepository),
            ChatRepository: asFunction(ChatRepository),
            FileRepository: asFunction(FileRepository),
            LotteryRepository: asFunction(LotteryRepository),
            PlannerRepository: asFunction(PlannerRepository),
            UserRepository: asFunction(UserRepository),

            ArticleService: asFunction(ArticleService),
            ChatService: asFunction(ChatService),
            FileService: asFunction(FileService),
            LotteryService: asFunction(LotteryService),
            PlannerService: asFunction(PlannerService),
            UserService: asFunction(UserService),

            ArticleController: asFunction(ArticleController),
            ChatController: asFunction(ChatController),
            FileController: asFunction(FileController),
            LotteryController: asFunction(LotteryController),
            PlannerController: asFunction(PlannerController),
            UserController: asFunction(UserController),

            ArticleRoute: asFunction(ArticleRoute),
            ChatRoute: asFunction(ChatRoute),
            FileRoute: asFunction(FileRoute),
            LotteryRoute: asFunction(LotteryRoute),
            PlannerRoute: asFunction(PlannerRoute),
            UserRoute: asFunction(UserRoute),
        })
        Log.debug(`Container created`)
        return container
    }

    return {get: name => container.resolve(name), init}
}

export default Container()
