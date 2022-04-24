import nodemailer from 'nodemailer'
import Config from '#configs/config'
import Log from '#utils/logger'
import Underscore from 'underscore'

const config = Config.mail

const auth = config.CONFIG.auth
if (!auth.user || !auth.clientId || !auth.clientSecret || !auth.refreshToken || !auth.accessToken) {
    Log.error('MailSender: Missing mail configuration')
    throw new Error('MailSender: Missing mail configuration')
}

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
