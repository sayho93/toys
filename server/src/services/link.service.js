const LinkService = ({LinkRepository, EncryptUtil}) => {
    const generateShortLink = async url => {
        const id = await LinkRepository.addLinkBase(url)
        const hash = EncryptUtil.hashEncode(id)
        await LinkRepository.modLink(id, hash)
        const info = await LinkRepository.getLink(id)
        return {data: info}
    }

    const getShortLink = async shortId => {
        const err = new Error()
        if (shortId.length !== 5) {
            err.status = 400
            err.message = 'id must be 5 characters long'
            throw err
        }

        const id = EncryptUtil.hashDecode(shortId)
        const ret = await LinkRepository.getLink(id)
        if (!ret) {
            err.status = 404
            err.message = 'Short link not found'
            throw err
        }
        return ret
    }

    return {
        generateShortLink,
        getShortLink,
    }
}

export default LinkService
