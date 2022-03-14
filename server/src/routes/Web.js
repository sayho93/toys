import express from 'express'
const router = express.Router()
import userSVC from 'src/services/UserSVC'
import chatSVC from 'src/services/ChatSVC'
import Response from 'src/utils/Response'
import ResponseConst from "src/utils/ResponseConst"
import passport from 'passport'
import Utils from "src/utils/Utils"
import validator from 'validator'

router.get("/test", async(req, res) => {
    let data = await chatSVC.chatMessageList(25)
    res.render('test', {title: "Express", data: data})
})

router.get('/', Utils.checkAuth, async(req, res) => {
    let data = await userSVC.userList()
    res.render('index', {title: "Express", data: data})
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('midnightAdmin', (err, user, info) => {
        if(!user) return res.json(Response(ResponseConst.CODE.CODE_NOT_EXISTING, ResponseConst.MSG.MSG_NOT_EXISTING))
        req.logIn(user,(err) => {
            if(err) return res.json(Response(ResponseConst.CODE.CODE_FAILURE, ResponseConst.MSG.MSG_FAILURE))
            return res.json(Response(ResponseConst.CODE.CODE_SUCCESS, ResponseConst.MSG.MSG_SUCCESS))
        })
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    res.json(Response(ResponseConst.CODE.CODE_SUCCESS, ResponseConst.MSG.MSG_SUCCESS))
})

router.get('/pages/register', Utils.checkAuth, (req, res) => {
    const query = req.query.query
    userSVC.betaUserList(query)
        .then(list => res.render('pages/register', {data: list}))
        .catch(() => res.render('error/500'))
})

router.get('/add/register', Utils.checkAuthForApi, (req, res) => {
    if(!validator.isEmail(req.query.email)) return res.json(Response(ResponseConst.CODE.CODE_INVALID_PARAM, ResponseConst.CUSTOM.MSG_INVALID_EMAIL))
    let tmp = req.query.email.split('@')[1]
    switch(tmp){
        case "dgu.ac.kr": case "dongguk.edu":
        case "dgu.edu": case "mail.dgu.edu":
        case "mail.dongguk.edu":
            break
        default:
            return res.json(Response(ResponseConst.CODE.CODE_INVALID_PARAM, ResponseConst.CUSTOM.MSG_INVALID_EMAIL_ORG))
    }

    if(req.query.email === "" || req.query.name === "") return res.json(Response(ResponseConst.CODE.CODE_INVALID_PARAM, ResponseConst.MSG.MSG_INVALID_PARAM))
    userSVC.addBetaUser(req.query)
        .then(() => res.json(Response(ResponseConst.CODE.CODE_SUCCESS, ResponseConst.MSG.MSG_SUCCESS)))
        .catch(err => res.json(Response(ResponseConst.CODE.CODE_FAILURE, ResponseConst.MSG.MSG_FAILURE, err)))
})

router.get('/delete/register/:id', Utils.checkAuthForApi, (req, res) => {
    userSVC.deleteBetaUser(req.params.id)
        .then(ret => res.json(Response(ResponseConst.CODE.CODE_SUCCESS, ResponseConst.MSG.MSG_SUCCESS, ret)))
})

router.get('/pages/settings', Utils.checkAuth,(req, res) => {
    res.render('pages/settings')
})

export default router
