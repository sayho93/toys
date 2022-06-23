import {isMainThread, parentPort, Worker, workerData} from 'worker_threads'
import {fileURLToPath} from 'url'
import Log from '#utils/logger'

if (!isMainThread) {
    const n = workerData
    let sum = BigInt(0)
    for (let i = 0; i < n; i++) {
        sum += BigInt(i)
    }
    const avg = sum / BigInt(n - 1)
    parentPort?.postMessage(avg)
}

export function AverageJob(num: number): Promise<bigint> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(fileURLToPath(import.meta.url), {
            workerData: num,
        })
        const startTime = performance.now()

        worker
            .on('message', (ret: bigint) => {
                Log.info(ret)
                Log.debug(`Worker finished in ${performance.now() - startTime}ms`)
                resolve(ret)
            })
            .on('error', err => {
                Log.error(err.stack)
                reject(err)
            })
            .on('exit', code => {
                if (code !== 0) {
                    Log.error(`Worker stopped with exit code ${code}`)
                    reject(new Error(`Worker stopped with exit code ${code}`))
                }
            })
    })
}
