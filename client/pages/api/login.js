import {withIronSessionApiRoute} from 'iron-session/next'
import {sessionOptions} from 'lib/session'
import Constants from 'api/Constants'
import axios from 'axios'

export default withIronSessionApiRoute(loginRoute, sessionOptions)

async function loginRoute(req, res) {
    try {
        const params = new URLSearchParams(req.body)
        const data = await axios.post(Constants.API_LOGIN, params)
        if (!data.data) res.status(400).json({error: '일치하는 계정이 없습니다.', status: 400})
        else {
            const user = {isLoggedIn: true, ...data.data}
            req.session.user = user
            await req.session.save()
            res.json(user)
        }
    } catch (error) {
        res.status(error.response.status).json(error.response.data)
    }
}
