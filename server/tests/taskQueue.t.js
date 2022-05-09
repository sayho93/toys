import TaskQueueUtil from '#utils/taskQueue.util'

const concurrency2 = 2
const queue2 = TaskQueueUtil(concurrency2)

const wait = timeToDelay => new Promise(resolve => setTimeout(resolve, timeToDelay))

for (let i = 0; i < 10; i++) {
    queue2
        .runTask(async () => {
            await wait(2000)
        })
        .then(() => {
            console.log(i)
        })
}
