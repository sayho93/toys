import TaskQueueUtil from '#utils/taskQueue.util'
import {jest} from '@jest/globals'
import Log from '#utils/logger'

jest.setTimeout(20000)
describe('TaskQueueUtil', () => {
    test('TaskQueueUtil', async () => {
        const queue = TaskQueueUtil(4)

        const wait = timeToDelay => new Promise(resolve => setTimeout(resolve, timeToDelay))

        const jobs = Array.from({length: 10}, (_, idx) => idx + 1)

        await Promise.all(
            jobs.map(async idx => {
                await queue.runTask(async () => {
                    await wait(1500)
                    Log.info(`Task ${idx} is done`)
                })
            })
        )
    })
})
