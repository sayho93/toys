// noinspection DuplicatedCode
import request from 'supertest'
import Container from '#src/loaders/container'

const container = await Container.init()
const {default: InitApp} = await import('#src/loaders/initApp')
const app = InitApp()

test('/api/v1/user/:id', async () => {
    const ret = await request(app).get('/api/v1/user/45')
    expect(ret.status).toBe(200)
    expect(ret.body).toBeInstanceOf(Object)
})
