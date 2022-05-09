import Log from '#utils/logger'

const TaskQueue = concurrency => {
    const taskQueue = []
    const consumerQueue = []

    for (let i = 0; i < concurrency; i++) {
        _consumer()
    }

    async function _consumer() {
        while (true) {
            try {
                const task = await _getNextTask()
                // console.log('task is :::::')
                // console.log(task)
                await task()
            } catch (err) {
                Log.error(err.stack)
            }
        }
    }

    function _getNextTask() {
        return new Promise(resolve => {
            if (taskQueue.length !== 0) {
                return resolve(taskQueue.shift())
            }

            consumerQueue.push(resolve)
        })
    }

    const runTask = task => {
        return new Promise(resolve => {
            const taskWrapper = async () => {
                const ret = await task()
                return resolve(ret)
            }

            if (consumerQueue.length !== 0) {
                // there is a sleeping consumer available, use it to run our task
                const consumer = consumerQueue.shift()
                consumer(taskWrapper)
            } else {
                // all consumers are busy, enqueue the task
                taskQueue.push(taskWrapper)
            }
        })
    }

    return {runTask}
}

export default TaskQueue
