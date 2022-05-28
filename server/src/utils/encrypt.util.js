import crypto from 'crypto'

const EncryptUtil = () => {
    const base = 62
    const alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    return {
        encryptSHA(str) {
            return crypto.createHash('sha512').update(str).digest('base64')
        },
        hashEncode(num) {
            let encoded = ''
            while (num) {
                const remainder = num % base
                num = Math.floor(num / base)
                encoded = alphanumeric[remainder].toString() + encoded
            }
            return encoded.padStart(5, 'a')
        },
        hashDecode(code) {
            let decoded = 0
            for (let i = 0; i < code.length; i++) {
                let char = code[i]
                let value = alphanumeric.indexOf(char)
                decoded = decoded * base + value
            }
            return decoded
        },
    }
}

export default EncryptUtil()
