const Utils = {
    debounce: (callback, delay = 1000) => {
        let timeoutId
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                callback(...args)
            }, delay)
        }
    },
}

export default Utils
