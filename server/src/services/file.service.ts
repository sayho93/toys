import {Utils} from '#types/utils'

import path from 'path'
import slash from 'slash'
import sizeOf from 'image-size'
import File = Utils.File
import ErrorHandler = Utils.ErrorHandler
import FileService = Services.FileService
import FileRepository = Repositories.FileRepository

export const makeFileService = (repository: FileRepository, ErrorHandler: ErrorHandler, FileUtil: File, EXTERNAL_PATH: string): FileService => {
    const processFile = async (userId: number, file: Express.Multer.File, desc: string): Promise<number> => {
        console.log(file)

        const dimensions = sizeOf(file.path)
        let ext = FileUtil.getExtension(file.originalname)
        return await repository.addFile({
            userId,
            originName: file.originalname,
            path: slash(file.path),
            shortPath: slash(path.join(EXTERNAL_PATH, file.filename)),
            size: file.size,
            width: dimensions.width,
            height: dimensions.height,
            ext: ext,
            desc: desc,
        })
    }

    const removeFile = async (id: number): Promise<boolean> => {
        const file = await repository.getFile(id)
        console.log(file)
        if (!file) return false

        await FileUtil.removeFile(file.path)
        return await repository.removeFile(id)
    }

    const getFile = async (id: number): Promise<DTO.FileDTO> => {
        const file = await repository.getFile(id)
        if (!file) throw ErrorHandler.BaseError('File not found', 404)
        return file
    }

    return {
        processFile,
        removeFile,
        getFile,
    }
}
