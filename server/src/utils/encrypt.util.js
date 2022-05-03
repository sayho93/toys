import crypto from 'crypto'

const EncryptUtil = () => {
    const encryptSHA = str => crypto.createHash('sha512').update(str).digest('base64')

    return {
        encryptSHA,
    }
}

export default EncryptUtil()
