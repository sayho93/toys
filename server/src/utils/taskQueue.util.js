import Log from '#utils/logger'

const TaskQueue = concurrency => {
    const taskQueue = []
    const consumerQueue = []

    for (let i = 0; i < concurrency; i++) {
        consumer()
    }

    function consumer() {
        return new Promise((resolve, reject) => {
            const task = _getNextTask()
            resolve(task)
        })
            .then(task => task())
            .then(res => Log.info(res))
            .then(() => {
                if (taskQueue.length) consumer()
            })
    }

    function _getNextTask() {}

    const _next = async () => {
        while (running < concurrency && queue.length) {
            const task = queue.shift()
            running++
            try {
                await task()
            } finally {
                running--
                await _next()
            }
        }
    }

    const runTask = task => {
        return new Promise((resolve, reject) => {
            queue.push(async () => {
                try {
                    await task()
                    return resolve()
                } catch (err) {
                    return reject(err)
                }
            })

            process.nextTick(_next)
        })
    }

    return {runTask}
}

export default TaskQueue
