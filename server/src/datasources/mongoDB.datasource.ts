import {Datasources} from '#types/datasources'

import Log from '#utils/logger'
import mongoose from 'mongoose'
import MongoDBConf = Configs.MongoDBConf
import MongoDBDataSource = Datasources.MongoDBDataSource

export const makeMongoDBDatasource = (config: MongoDBConf): MongoDBDataSource => {
    if (!config.host || !config.user || !config.password) throw new Error('DatasourceMongo configuration error')
    mongoose.connect(
        `mongodb://${config.host}`,
        {
            user: config.user,
            pass: config.password,
            authMechanism: config.authMechanism,
            authSource: config.authSource,
        },
        err => {
            if (err) {
                console.log(err)
                Log.error(err)
                throw new Error('Mongo connection error')
            }
            Log.verbose('Connected to MongoDB')
        }
    )

    return {instance: mongoose}
}
