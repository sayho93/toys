import {Datasources} from '#types/datasources'

import Log from '#utils/logger'
import mongoose, {ConnectOptions} from 'mongoose'
import MongoDBConf = Configs.MongoDBConf
import MongoDBDataSource = Datasources.MongoDBDataSource

export const makeMongoDBDatasource = (config: MongoDBConf): MongoDBDataSource => {
    if (!config.host || !config.user || !config.password) throw new Error('DatasourceMongo configuration error')

    const options: ConnectOptions = {
        user: config.user,
        pass: config.password,
        authMechanism: 'DEFAULT',
        authSource: 'admin',
    }

    mongoose.connect(`mongodb://${config.host}`, options, err => {
        if (err) {
            console.log(err)
            Log.error(err)
            throw new Error('Mongo connection error')
        }
        Log.verbose('Connected to MongoDB')
    })

    return {instance: mongoose}
}
