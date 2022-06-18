import makeMariaDB from '#datasources/makeMariaDB'
import Config from '#configs/config'
import ErrorHandlerUtil from '#utils/errorHandler.util'

const MariadbImpl = makeMariaDB(Config.datasource.mariaDB, ErrorHandlerUtil)

export default MariadbImpl
