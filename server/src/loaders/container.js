import {asFunction, asValue, createContainer, InjectionMode} from 'awilix'

import Config from '#configs/config'

/* Loaders */
import RequestBatch from '#src/loaders/requestBatch'

/* Datasources */
import RedisDatasource from '#datasources/redis.datasource'
import MariaDBDatasource from '#datasources/mariaDB.datasource'
import MongoDBDatasource from '#datasources/mongoDB.datasource'

/* Utils */
import Log from '#utils/logger'
import * as Utils from '#utils/common.util'
import MailSender from '#utils/MailSender'
import PushManager from '#utils/PushManager'

/* Jobs */
import {AverageJob} from '#src/jobs/average.job'
import LotteryJob from '#src/jobs/lottery.job'
import {FileUtil, Multipart} from '#utils/file.util'

const Container = () => {
    const container = createContainer({
        injectionMode: InjectionMode.PROXY,
    })

    const formatName = name => {
        const [fName, namespace] = name.split('.')
        const fNameFormatted = fName.charAt(0).toUpperCase() + fName.slice(1)
        const namespaceFormatted = namespace.charAt(0).toUpperCase() + namespace.slice(1)
        Log.debug(`${fNameFormatted}${namespaceFormatted} registered`)
        return `${fNameFormatted}${namespaceFormatted}`
    }

    const init = async () => {
        await container.loadModules(['src/routes/api/v1/*.route.js', 'src/models/*.js', 'src/repositories/*.js', 'src/services/*.js', 'src/controllers/*.js'], {
            esModules: true,
            formatName,
        })

        await container.register({
            Config: asValue(Config),
            RequestBatch: asFunction(RequestBatch).singleton(),

            RedisClient: asFunction(RedisDatasource).singleton(),
            DataSourceMariaDB: asFunction(MariaDBDatasource).singleton(),
            DataSourceMongoDB: asFunction(MongoDBDatasource).singleton(),

            Utils: asValue(Utils),
            FileUtil: asValue(FileUtil),
            Multipart: asValue(Multipart),
            MailSender: asValue(MailSender),
            PushManager: asValue(PushManager),
            Log: asValue(Log),

            AverageJob: asValue(AverageJob),
            LotteryJob: asFunction(LotteryJob),
        })

        console.log(container)
        Log.debug(`Container created`)
    }

    return {get: name => container.resolve(name), init}
}

export default Container()
