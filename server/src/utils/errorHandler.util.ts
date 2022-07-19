import {validationResult} from 'express-validator'
import {Request} from 'express-validator/src/base'
import Config from '#configs/config'
import {EmbedBuilder, WebhookClient} from 'discord.js'
import HttpUtil from '#utils/http.util'

const ErrorHandlerUtil = () => {
    const BaseError = (message: string, status: number) => {
        const err = new Error(message)
        return {
            status,
            name: err.name,
            message: err.message,
            stack: err.stack,
        }
    }

    const validationErrorHandler = (req: Request) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw BaseError(errors.array()[0].msg, 400)
        }
    }

    const getWebhookCredentials = async () => {
        if (!Config.app.WEBHOOK_URL) throw new Error('webhook url is required')
        const webhookInfo = await HttpUtil.getData(Config.app.WEBHOOK_URL)
        Config.app.WEBHOOK_ID = webhookInfo.id
        Config.app.WEBHOOK_TOKEN = webhookInfo.token
    }

    const dispatchErrorLog = async (error: Error, title?: string) => {
        if (!Config.app.WEBHOOK_ID || !Config.app.WEBHOOK_TOKEN) throw new Error('webhook credentials are missing')

        const webhookClient = new WebhookClient({id: Config.app.WEBHOOK_ID, token: Config.app.WEBHOOK_TOKEN})
        const embed = new EmbedBuilder()
            .setTitle(title ? title : 'Error Report')
            .setColor('#ff0000')
            .setDescription(<string>error.stack)
            .addFields([
                {name: 'Message', value: error.message},
                // {name: 'Cause', value: error.cause ? error.cause + '' : ''},
            ])
        await webhookClient.send({embeds: [embed]})
    }

    return {
        BaseError,
        validationErrorHandler,
        getWebhookCredentials,
        dispatchErrorLog,
    }
}

export default ErrorHandlerUtil()
