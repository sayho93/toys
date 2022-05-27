import {withIronSessionApiRoute} from 'iron-session/next'
import {sessionOptions} from 'lib/session'
import axios from 'axios'
import Constants from '../../api/Constants'
import https from 'https'

export default withIronSessionApiRoute(userRoute, sessionOptions)

async function userRoute(req, res) {
    if (req.session.user) {
        // in a real world application you might read the user id from the session and then do a database request
        // to get more information on the user if needed
        try {
            const data = await axios.get(`${Constants.API_USER}/${req.session.user.id}`, {httpsAgent: new https.Agent({rejectUnauthorized: false})})
            if (data.status !== 200) {
                res.status(data.status).json({error: data.error})
            }
            const user = {isLoggedIn: true, ...data.data}
            req.session.user = user
            await req.session.save()
            res.json(user)
        } catch (error) {
            console.log(error)
            // alert('Internal server error')
            res.status(500).json({error: 'Internal Server Error'})
        }
    } else res.json({isLoggedIn: false})
}
