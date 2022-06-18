import Log from '#utils/logger'

const RequestBatcher = () => {
    const runningRequest = new Map()

    const check = (key: string, promise: () => Promise<any>) => {
        if (runningRequest.has(key)) {
            Log.info(`Batching ${key}`)
            console.log(runningRequest)
            return runningRequest.get(key)
        }

        const resPromise = promise()
        runningRequest.set(key, resPromise)
        return resPromise
            .then((res: any) => {
                runningRequest.delete(key)
                return res
            })
            .catch((err: Error) => {
                Log.error(err.stack)
                runningRequest.delete(key)
            })
    }

    // const set = (key: string, promise: Promise<any>) => {
    //     runningRequest.set(key, promise)
    // }

    return {
        check,
    }
}

export default RequestBatcher()
