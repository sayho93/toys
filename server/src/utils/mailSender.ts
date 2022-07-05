import nodemailer, {SendMailOptions} from 'nodemailer'
import Config from '#configs/config'
import Log from '#utils/logger'
import Underscore from 'underscore'
import ErrorHandler from '#utils/errorHandler.util'

const MailSender = () => {
    const config = Config.mail

    const auth = config.CONFIG.auth
    if (!auth.user || !auth.clientId || !auth.clientSecret || !auth.refreshToken || !auth.accessToken) {
        Log.error('MailSender: Missing mail configuration')
        throw new Error('MailSender: Missing mail configuration')
    }
    // @ts-ignore
    const transporter = nodemailer.createTransport(config.CONFIG)

    const MULTICAST_LIMIT_SIZE = 3
    const failed: string[] = []

    const sendMailTo = async (title: string, message: string, {name, addr}: {name: string; addr: string}, html = '') => {
        const to = `${name} <${addr}>`
        const mailObj = {
            from: `${config.NAME} <${config.CONFIG.auth.user}>`,
            to: to,
            subject: title,
            text: message,
            html: html,
        }
        Log.verbose(JSON.stringify(mailObj))

        try {
            const res = await transporter.sendMail(mailObj)
            Log.verbose(JSON.stringify(res))
            return true
        } catch (err: any) {
            console.log(err)
            Log.error(failed)
            failed.push(to)
            await ErrorHandler.dispatchErrorLog(err)
            return false
        }
    }

    const sendMailToMulti = async (title: string, message: string, list: {name: string; addr: string}[]) => {
        const multicastUnit = Underscore.chunk(list, MULTICAST_LIMIT_SIZE)
        Log.verbose(JSON.stringify(multicastUnit))

        const mailObj: SendMailOptions = {
            from: `${config.NAME} <${config.CONFIG.auth.user}>`,
            subject: title,
            text: message,
            html: '',
            to: '',
        }

        const promises = multicastUnit.map(async list => {
            const to = list.map(item => `${item.name} <${item.addr}>`)
            Log.verbose(JSON.stringify(to))

            for (let item of to) {
                mailObj.to = item

                try {
                    await transporter.sendMail(mailObj)
                } catch (err: any) {
                    await ErrorHandler.dispatchErrorLog(err)
                    Log.error(err.stack)
                    failed.push(item)
                }
            }
        })
        await Promise.all(promises)
        return failed
    }

    return {sendMailTo, sendMailToMulti}
}
export default MailSender()
