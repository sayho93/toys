import Log from '#utils/logger'

const RequestBatch = () => {
    const runningRequest = new Map()

    const check = (key, promise) => {
        if (runningRequest.has(key)) {
            Log.info(`Batching ${key}`)
            console.log(runningRequest)
            return runningRequest.get(key)
        }

        const resPromise = promise()
        runningRequest.set(key, resPromise)
        return resPromise
            .then(res => {
                runningRequest.delete(key)
                return res
            })
            .catch(err => {
                Log.error(err.stack)
                runningRequest.delete(key)
            })
    }

    const set = key => {
        runningRequest.set(key, key)
    }

    return {
        check,
        set,
    }
}

export default RequestBatch
