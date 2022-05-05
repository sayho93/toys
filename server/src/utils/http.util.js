import axios from 'axios'

const httpErrorHandler = error => {
    console.log(error)
    console.log(error.status)
    const err = new Error('http error')
    err.status = 400
    throw err
}

const createFetcher = () => {
    const _identifier = Symbol('__FETCHER__')
    let fetchStrategy

    const _isFetcher = fn => _identifier in fn

    const _createFetch = fn => {
        const fetchFn = async function _fetch(url, args) {
            return fn(url, args)
        }
        fetchFn[_identifier] = true
        return fetchFn
    }

    return {
        fetch: (url, args) => {
            return fetchStrategy(url, args)
        },
        create: fn => {
            return _createFetch(fn)
        },
        use: fetcher => {
            if (!_isFetcher(fetcher)) {
                throw new Error(`The fetcher provided is invalid`)
            }
            fetchStrategy = fetcher
        },
    }
}

const HttpUtil = createFetcher()

const makeFetch = method => {
    return HttpUtil.create(async (url, data = {}) => {
        const options = {
            method,
            headers: {'Content-Type': 'application/json'},
        }

        options.method === 'GET' || options.method === 'DELETE'
            ? (url = `${url}?${Object.keys(data)
                  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
                  .join('&')}`)
            : (options.body = JSON.stringify(data))

        try {
            const res = await fetch(url, options)
            return res.json()
        } catch (error) {
            httpErrorHandler(error)
        }
    })
}

const makeAxios = method => {
    return HttpUtil.create(async (url, data = {}) => {
        const options = {
            method,
        }
        options.url = url
        options.method === 'GET' || options.method === 'DELETE' ? (options.params = data) : (options.data = data)

        try {
            const res = await axios(options)
            return res.data
        } catch (error) {
            httpErrorHandler(error)
        }
    })
}

const HttpStrategy = {
    axios: {
        get: makeAxios('GET'),
        post: makeAxios('POST'),
        put: makeAxios('PUT'),
        patch: makeAxios('PATCH'),
        delete: makeAxios('DELETE'),
    },
    fetch: {
        get: makeFetch('GET'),
        post: makeFetch('POST'),
        put: makeFetch('PUT'),
        patch: makeFetch('PATCH'),
        delete: makeFetch('DELETE'),
    },
}

HttpUtil.strategy = HttpStrategy

export default HttpUtil
