import HttpUtil from '#utils/http.util'

const url = 'http://localhost:4000/api/v1/user/test/http'

try {
    HttpUtil.use(HttpUtil.strategy.axios.get)
    console.log(await HttpUtil.fetch(url))
    const ret = await HttpUtil.fetch(url, {id: 1, name: 'test', email: 'test@test.com'})
    console.log(ret)

    HttpUtil.use(HttpUtil.strategy.axios.post)
    console.log(await HttpUtil.fetch(url, {id: 1, name: 'test', email: 'test@test.com'}))

    HttpUtil.use(HttpUtil.strategy.axios.put)
    console.log(await HttpUtil.fetch(url, {id: 1, name: 'test', email: 'test@test.com'}))

    HttpUtil.use(HttpUtil.strategy.axios.patch)
    console.log(await HttpUtil.fetch(url, {id: 1, name: 'test', email: 'test@test.com'}))

    HttpUtil.use(HttpUtil.strategy.axios.delete)
    console.log(await HttpUtil.fetch(url))

    HttpUtil.use(HttpUtil.strategy.fetch.get)
    console.log(await HttpUtil.fetch(url))
    console.log(await HttpUtil.fetch(url, {id: 1, name: 'test', email: 'test@test.com'}))

    HttpUtil.use(HttpUtil.strategy.fetch.post)
    console.log(await HttpUtil.fetch(url, {id: 1, name: 'test', email: 'test@test.com'}))

    HttpUtil.use(HttpUtil.strategy.fetch.put)
    console.log(await HttpUtil.fetch(url, {id: 1, name: 'test', email: 'test@test.com'}))

    HttpUtil.use(HttpUtil.strategy.fetch.patch)
    console.log(await HttpUtil.fetch(url, {id: 1, name: 'test', email: 'test@test.com'}))

    HttpUtil.use(HttpUtil.strategy.fetch.delete)
    console.log(await HttpUtil.fetch(url))
} catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
}
