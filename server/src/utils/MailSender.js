import nodemailer from 'nodemailer'
import Config from 'src/config/Config'
import Log from 'src/utils/Logger'
import Underscore from 'underscore'
import dotenv from 'dotenv'

dotenv.config()

const config = Config.app.MAIL
const {OAUTH_USER, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN, OAUTH_ACCESS_TOKEN} = process.env
if (!OAUTH_USER || !OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET || !OAUTH_REFRESH_TOKEN) throw Error('OAuth 인증에 필요한 환경변수가 없습니다.')
config.CONFIG.auth.user = OAUTH_USER
config.CONFIG.auth.clientId = OAUTH_CLIENT_ID
config.CONFIG.auth.clientSecret = OAUTH_CLIENT_SECRET
config.CONFIG.auth.refreshToken = OAUTH_REFRESH_TOKEN
config.CONFIG.auth.accessToken = OAUTH_ACCESS_TOKEN

const MULTICAST_LIMIT_SIZE = 3

const transporter = nodemailer.createTransport(config.CONFIG)

const failed = []

const MailSender = {
    sendMailTo: async (title, message, {name, addr}, html = '') => {
        const to = `${name} <${addr}>`
        Log.http(to)
        const mail = {
            from: `${config.NAME} <${config.CONFIG.auth.user}>`,
            to: to,
            subject: title,
            text: message,
            html: html,
        }
        Log.verbose(JSON.stringify(mail))
        try {
            const res = await transporter.sendMail(mail)
            Log.verbose(JSON.stringify(res))
            return true
        } catch (err) {
            console.log(err)
            Log.error(failed)
            failed.push(to)
            return false
        }
    },

    async sendMailToMulti(title, message, list) {
        const multicastUnit = Underscore.chunk(list, MULTICAST_LIMIT_SIZE)
        Log.verbose(JSON.stringify(multicastUnit))

        const mail = {
            from: `${config.NAME} <${config.CONFIG.auth.user}>`,
            to: null,
            subject: title,
            text: message,
            html: '',
        }

        const promises = multicastUnit.map(async list => {
            const to = list.map(item => `${item.name} <${item.addr}>`)
            Log.verbose(JSON.stringify(to))
            try {
                for (let item of to) {
                    mail.to = item
                    await transporter.sendMail(mail)
                }
            } catch (err) {
                console.error(err)
                failed.push(err)
            }
        })
        await Promise.all(promises)
        return failed
    },
}
export default MailSender
