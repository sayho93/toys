import {withIronSessionApiRoute} from 'iron-session/next'
import {sessionOptions} from 'lib/session'
import axios from 'axios'
import Constants from '../../api/Constants'

export default withIronSessionApiRoute(userRoute, sessionOptions)

async function userRoute(req, res) {
    if (req.session.user) {
        // in a real world application you might read the user id from the session and then do a database request
        // to get more information on the user if needed
        const data = await axios.get(`${Constants.API_USER}/${req.session.user.id}`)
        const user = {isLoggedIn: true, ...data.data}
        req.session.user = user
        await req.session.save()
        res.json(user)
    } else res.json({isLoggedIn: false})
}
