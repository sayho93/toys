import MariaDBConf = Configs.MariaDBConf
import MariaDBDataSource = Datasources.MariaDBDataSource
import ErrorHandler = Utils.ErrorHandler
import {Datasources} from '#types/datasources'
import {Utils} from '#types/utils'

import mysql2 from 'mysql2/promise'
import Log from '#utils/logger'

export const makeMariaDBDatasource = (config: MariaDBConf, ErrorHandler: ErrorHandler): MariaDBDataSource => {
    if (!config.host || !config.user || !config.password || !config.database) throw new Error('Datasource configuration error')

    const pool = mysql2.createPool(config)

    const exec = async (sql: string, params: any) => {
        try {
            const query = mysql2.format(sql, params)
            Log.verbose(query)
            const [ret] = await pool.query(sql, params)
            return ret
        } catch (error: any) {
            await ErrorHandler.dispatchErrorLog(error)
            Log.error(error.stack)
            throw ErrorHandler.BaseError('database error', 500)
        }
    }

    pool.getConnection().then(conn => {
        Log.verbose('Connected to MariaDB')
        conn.release()
    })

    return {pool, exec}
}
