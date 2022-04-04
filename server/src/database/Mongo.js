const Mongo = (mongoose, config, Log) => {
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
            if (err) throw new Error(err)
            Log.verbose('Connected to MongoDB')
        }
    )
}

export default Mongo
