import {Datasources} from '#types/datasources'
import {Utils} from '#types/utils'

import mysql2 from 'mysql2/promise'
import Log from '#utils/logger'
import ErrorHandler = Utils.ErrorHandler
import MariaDBConf = Configs.MariaDBConf
import MariaDBDataSource = Datasources.MariaDBDataSource

const makeMariaDB = (config: MariaDBConf, ErrorHandler: ErrorHandler): MariaDBDataSource => {
    if (!config.host || !config.user || !config.password) throw new Error('Datasource configuration error')

    const pool = mysql2.createPool(config)

    const exec = async (sql: string, params: any) => {
        try {
            // @ts-ignore
            const query = pool.format(sql, params)
            Log.verbose(query)
            const [ret] = await pool.query(sql, params)
            return ret
        } catch (error: any) {
            await ErrorHandler.dispatchErrorLog(error)
            Log.error(error.message)
            throw ErrorHandler.BaseError('database error', 500)
        }
    }

    return {pool, exec}
}
export default makeMariaDB
