import {validationResult} from 'express-validator'
import {Request} from 'express-validator/src/base'

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

    return {
        BaseError,
        validationErrorHandler,
    }
}

export default ErrorHandlerUtil()
