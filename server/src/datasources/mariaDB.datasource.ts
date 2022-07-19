import MariaDBConf = Configs.MariaDBConf
import MariaDBDataSource = Datasources.MariaDBDataSource
import ErrorHandler = Utils.ErrorHandler
import {Datasources} from '#types/datasources'
import {Utils} from '#types/utils'

import mysql2, {Pool} from 'mysql2/promise'
import Log from '#utils/logger'

export const makeMariaDBDatasource = (config: MariaDBConf, ErrorHandler: ErrorHandler): MariaDBDataSource => {
    if (!config.host || !config.user || !config.password || !config.database) throw new Error('Datasource configuration error')

    let pool: Pool
    let connected: Boolean = false
    let commandQueue: (() => Promise<any>)[] = []

    const init = async () => {
        pool = mysql2.createPool(config)
        connected = true
        Log.verbose('Connected to MariaDB')
    }

    init().then(() => {
        commandQueue.forEach(command => command())
        commandQueue = []
    })

    async function exec(sql: string, params: any) {
        const query: string = mysql2.format(sql, params)
        if (!connected) {
            Log.info(`Request Queued: ${query}`)

            return new Promise(resolve => {
                const command = async () => resolve(await exec(query, params))
                commandQueue.push(command)
            })
        }

        try {
            Log.verbose(query)
            const [ret] = await pool.query(query, params)
            return ret
        } catch (error: any) {
            await ErrorHandler.dispatchErrorLog(error)
            Log.error(error.stack)
            throw ErrorHandler.BaseError('database error', 500)
        }
    }

    return {exec}
}
