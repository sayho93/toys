import {Datasources} from '#types/datasources'

import schedule from 'node-schedule'
import Log from '#utils/logger'
import RedisDataSource = Datasources.RedisDataSource
import LotteryService = Services.LotteryService

const LotteryJob = (service: LotteryService, RedisClient: RedisDataSource) => {
    const _checkNums = () => {
        const rule = new schedule.RecurrenceRule()
        rule.second = 0
        rule.minute = 0
        schedule.scheduleJob(rule, async () => {
            await service.batchProcess()
            RedisClient.instance.emit('delWithPrefix', 'lottery')
        })
    }

    const _notifier = () => {
        const rule = new schedule.RecurrenceRule()
        rule.second = 0
        rule.minute = 50
        rule.hour = 20
        rule.dayOfWeek = 6
        schedule.scheduleJob(rule, async () => {
            await service.notify()
        })
    }

    const start = () => {
        Log.error(process.env.INSTANCE_ID)
        if (process.env.NODE_ENV === 'production' && process.env.INSTANCE_ID === '0') {
            _checkNums()
            _notifier()
            Log.verbose('LotteryJob initialized')
            return
        }
        Log.verbose('LotteryJob disabled (NODE_ENV=development)')
    }

    return {start}
}

export default LotteryJob
