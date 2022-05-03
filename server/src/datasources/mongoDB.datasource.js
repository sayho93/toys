import Log from '#utils/logger'
import mongoose from 'mongoose'

const MongoDBDatasource = ({Config}) => {
    const config = Config.datasource.mongoDB
    if (!config.host || !config.user || !config.password) throw new Error('DatasourceMongo configuration error')
    mongoose.connect(
        `mongodb://${config.host}`,
        {
            user: config.user,
            pass: config.password,
            authMechanism: 'DEFAULT',
            authSource: 'admin',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        err => {
            if (err) {
                Log.error(err)
                throw new Error('Mongo connection error')
            }
            Log.verbose('Connected to MongoDB')
        }
    )

    return mongoose
}

export default MongoDBDatasource
