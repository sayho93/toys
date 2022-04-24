import axios from 'axios'
import crypto from 'crypto'
import moment from 'moment'
import {validationResult} from 'express-validator'

export const getData = async (url, params = {}) => {
    try {
        const response = await axios.get(url, {params: params})
        return response.data
    } catch (error) {
        console.log(error)
        const err = new Error('axios error')
        err.status = 400
        throw err
    }
}

export const postData = async (url, data = {}) => {
    try {
        const response = await axios.post(url, data)
        return response.data
    } catch (error) {
        console.log(error)
        const err = new Error('axios error')
        err.status = 400
        throw err
    }
}

export const getWeek = () => {
    const t1 = moment('2002-12-07 21:00:00', 'YYYY-MM-DD hh:mm:ss')
    const t2 = moment()
    // const t2 = moment('2022-03-12 21:01:00', 'YYYY-MM-DD hh:mm:ss')
    const dff = moment.duration(t2.diff(t1)).asDays()
    return Math.ceil(dff / 7) + 1
}

export const encryptSHA = str => crypto.createHash('sha512').update(str).digest('base64')

export const validationErrorHandler = req => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg)
        err.status = 400
        throw err
    }
}

export const AsyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
