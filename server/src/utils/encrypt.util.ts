import crypto from 'crypto'

const EncryptUtil = () => {
    const base = 62
    const alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    const encryptSHA = (str: string): string => {
        return crypto.createHash('sha512').update(str).digest('base64')
    }

    const hashEncode = (num: number): string => {
        let encoded = ''
        while (num) {
            const remainder = num % base
            num = Math.floor(num / base)
            encoded = alphanumeric[remainder].toString() + encoded
        }
        return encoded.padStart(5, 'a')
    }

    const hashDecode = (code: string): number => {
        let decoded = 0
        for (let i = 0; i < code.length; i++) {
            let char = code[i]
            let value = alphanumeric.indexOf(char)
            decoded = decoded * base + value
        }
        return decoded
    }

    return {
        encryptSHA,
        hashEncode,
        hashDecode,
    }
}

export default EncryptUtil()
