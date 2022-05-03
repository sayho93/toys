import {validationResult} from 'express-validator'

const ErrorHandlerUtil = () => {
    const validationErrorHandler = req => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const err = new Error(errors.array()[0].msg)
            err.status = 400
            throw err
        }
    }

    return {
        validationErrorHandler,
    }
}

export default ErrorHandlerUtil()
