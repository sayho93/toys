import schedule from 'node-schedule'
import Log from '#utils/logger'

const LotteryJob = ({LotteryService, RedisClient}) => {
    const checkNums = () => {
        const rule = new schedule.RecurrenceRule()
        rule.second = 0
        rule.minute = 0
        schedule.scheduleJob(rule, async () => {
            await LotteryService.batchProcess()
            RedisClient.emit('delWithPrefix', 'lottery')
        })
    }

    const notifier = () => {
        const rule = new schedule.RecurrenceRule()
        rule.second = 0
        rule.minute = 50
        rule.hour = 20
        rule.dayOfWeek = 6
        schedule.scheduleJob(rule, async () => {
            await LotteryService.notify()
        })
    }

    const start = () => {
        if (process.env.NODE_ENV === 'production' && process.env.INSTANCE_ID === '0001') {
            checkNums()
            notifier()
            Log.verbose('LotteryJob initialized')
        }
    }

    return {start}
}

export default LotteryJob
