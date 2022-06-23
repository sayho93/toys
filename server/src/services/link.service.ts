import {Utils} from '#types/utils'
import Encryptor = Utils.Encryptor
import ErrorHandler = Utils.ErrorHandler
import LinkRepository = Repositories.LinkRepository
import LinkService = Services.LinkService

export const makeLinkService = (repository: LinkRepository, ErrorHandler: ErrorHandler, EncryptUtil: Encryptor): LinkService => {
    const generateShortLink = async (url: string) => {
        const id = await repository.addLinkBase(url)
        const hash = EncryptUtil.hashEncode(id)
        const affectedRows = await repository.modLink(id, hash)
        if (affectedRows === 0) throw ErrorHandler.BaseError('affectedRows is 0', 500)

        const info = await repository.getLink(id)
        if (!info) throw ErrorHandler.BaseError('link not found', 404)
        return {data: info}
    }

    const getShortLink = async (shortId: string) => {
        if (shortId.length !== 5) throw ErrorHandler.BaseError('id must be 5 characters long', 400)

        const id: number = EncryptUtil.hashDecode(shortId)
        const ret: DTO.LinkDTO | undefined = await repository.getLink(id)
        if (!ret) throw ErrorHandler.BaseError('link not found', 404)
        return ret
    }

    return {
        generateShortLink,
        getShortLink,
    }
}
