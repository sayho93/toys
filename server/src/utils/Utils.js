import crypto from 'crypto'
import axios from 'axios'
import Log from 'src/utils/Logger'
import Config from 'src/config/Config'
import moment from 'moment'
// const iv = Config.app.AES_KEY.substring(0, 16)

const Utils = {
    encryptSHA: str => crypto.createHash('sha512').update(str).digest('base64'),

    createSalt: () => {
        console.log('::::::::createSalt::::::::')
        return crypto.randomBytes(64).toString('base64')
    },

    encryptSHAWithSalt: (str, salt = null) => {
        return new Promise(async (resolve, reject) => {
            if (salt == null) salt = Utils.createSalt()
            crypto.pbkdf2(str, salt, 9999, 64, 'sha512', (err, key) => {
                if (err) reject(err)
                resolve({password: key.toString('base64'), salt})
            })
        })
    },

    encryptAES: str => {
        const cipher = crypto.createCipheriv('AES-256-CBC', Utils.nullPad(Config.app.AES_KEY, 32), Utils.nullPad(Config.app.AES_KEY, 16))
        console.log(cipher)
        let res = cipher.update(str, 'utf-8', 'base64')
        res += cipher.final('base64')
        return res
    },

    decryptAES: str => {
        const deCipher = crypto.createCipheriv('AES-256-CBC', Utils.nullPad(Config.app.AES_KEY, 32), Utils.nullPad(Config.app.AES_KEY, 16))
        let res = deCipher.update(str, 'base64', 'utf-8')
        res += deCipher.final('utf-8')
        return res
    },

    getData: async (url, params = {}) => {
        const response = await axios.get(url, {params: params})
        return response.data
    },

    postData: async (url, data = {}) => {
        const response = await axios.post(url, data)
        return response.data
    },

    nullPad: (str, len) => {
        if (str.length >= len) return str
        return str + Array(len - str.length + 1).join('\x00')
    },

    getWeek: () => {
        const t1 = moment('2002-12-07 21:00:00', 'YYYY-MM-DD hh:mm:ss')
        const t2 = moment()
        // const t2 = moment('2022-03-12 21:01:00', 'YYYY-MM-DD hh:mm:ss')
        const dff = moment.duration(t2.diff(t1)).asDays()
        return Math.ceil(dff / 7) + 1
    },

    delay: ms => new Promise(res => setTimeout(res, ms)),
}

export default Utils
