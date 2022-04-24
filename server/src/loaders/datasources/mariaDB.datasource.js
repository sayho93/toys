import mysql2 from 'mysql2/promise'
import Log from '#utils/logger'

const MariaDBDatasource = config => {
    if (!config.host || !config.user || !config.password || !config.database) throw new Error('Datasource configuration error')

    const pool = mysql2.createPool(config)

    const exec = async (sql, params) => {
        try {
            const query = pool.format(sql, params)
            Log.verbose(query)
            const [ret] = await pool.query(sql, params)
            return [ret]
        } catch (error) {
            Log.error(error.message)
            const err = new Error('database error')
            err.status = 500
            throw err
        }
    }

    return {pool, exec}
}
export default MariaDBDatasource
