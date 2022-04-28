import {isMainThread, parentPort, Worker, workerData} from 'worker_threads'
import {fileURLToPath} from 'url'
import Log from '#utils/logger'

// const n = 45000000
// let sum = BigInt(0)
// console.time('calc')
// for (let i = 0; i < n; i++) {
//     sum += BigInt(i)
// }
// const avg = sum / BigInt(n - 1)
// console.timeEnd('calc')
// console.log('avg: ' + avg)

if (isMainThread) {
    const calcAvg = function calcAvg(script) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(fileURLToPath(import.meta.url), {
                workerData: script,
            })
            worker
                .on('message', resolve)
                .on('error', err => {
                    Log.error(err.stack)
                    // reject(err)
                })
                .on('exit', code => {
                    if (code === 0) Log.info(`Worker stopped with exit code ${code}`)
                    else {
                        Log.error(`Worker stopped with exit code ${code}`)
                        // reject(new Error(`Worker stopped with exit code ${code}`))
                    }
                })
        })
    }
    const n = 45000000
    console.time('calc')

    calcAvg(n).then(avg => {
        console.timeEnd('calc')
        console.log('avg: ' + avg)
    })
} else {
    const n = workerData
    let sum = BigInt(0)
    for (let i = 0; i < n; i++) {
        sum += BigInt(i)
    }
    const avg = sum / BigInt(n - 1)
    // const avg = sum / (n - 1)

    parentPort.postMessage(avg)
}
