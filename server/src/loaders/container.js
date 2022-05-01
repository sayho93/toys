import {asFunction, asValue, createContainer, InjectionMode, Lifetime} from 'awilix'
import Config from '#configs/config'

import MariaDBDatasource from '#src/loaders/datasources/mariaDB.datasource'
import RedisDatasource from '#src/loaders/datasources/redis.datasource'

import UserRepository from '#repositories/user.repository'

import UserService from '#services/user.service'

import UserController from '#controllers/user.controller'
import Log from '#utils/logger'
import PlannerRepository from '#repositories/planner.repository'
import * as Utils from '#utils/common.util'
import MailSender from '#utils/MailSender'
import PushManager from '#utils/PushManager'
import {AverageJob} from '#src/jobs/average.job'

const Container = () => {
    const container = createContainer({
        injectionMode: InjectionMode.PROXY,
    })

    container.loadModules(['#repositories/*.repository.js', '#services/*.service.js', '#controllers/*.controller.js'], {
        resolverOptions: {
            lifetime: Lifetime.SINGLETON,
            formatName: 'camelCase',
        },
    })

    container.register({
        Config: asValue(Config),

        Utils: asValue(Utils),
        MailSender: asValue(MailSender),
        PushManager: asValue(PushManager),

        AverageJob: asValue(AverageJob),

        RedisClient: asValue(RedisDatasource),

        UserController: asFunction(UserController),

        UserService: asFunction(UserService),

        UserRepository: asFunction(UserRepository),
        PlannerRepository: asFunction(PlannerRepository),

        DataSourceMariaDB: asFunction(MariaDBDatasource),
    })

    Log.debug('Container created')

    return container
}

export default Container()
