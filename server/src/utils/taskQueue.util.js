import Log from '#utils/logger'

const TaskQueue = concurrency => {
    const taskQueue = []
    const consumerQueue = []

    for (let i = 0; i < concurrency; i++) {
        consumer()
    }

    async function consumer() {
        while (true) {
            const task = await _getNextTask()
            await task()
            // try {
            //     const task = await _getNextTask()
            //     await task()
            // } catch (error) {
            //     Log.error(error)
            // }
        }
    }

    function _getNextTask() {
        return new Promise(resolve => {
            if (taskQueue.length) {
                return resolve(taskQueue.shift())
            }
            consumerQueue.push(resolve)
        })
    }

    const runTask = task => {
        return new Promise((resolve, reject) => {
            const taskWrapper = async () => {
                try {
                    await task()
                    return resolve()
                } catch (err) {
                    Log.error(err.stack)
                    return reject(err)
                }
            }

            if (consumerQueue.length) {
                const consumer = consumerQueue.shift()
                consumer(taskWrapper)
            } else taskQueue.push(taskWrapper)
        })
    }

    return {runTask}
}

export default TaskQueue
