import {isMainThread, parentPort, workerData} from 'worker_threads'

if (isMainThread) {
    // const n = 45000000
    // console.time('calc')
    //
    // calcAvg(n).then(avg => {
    //     console.timeEnd('calc')
    //     console.log('avg: ' + avg)
    //     return avg
    // })
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
