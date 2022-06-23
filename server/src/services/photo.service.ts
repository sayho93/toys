import {Utils} from '#types/utils'
import ErrorHandler = Utils.ErrorHandler
import PhotoService = Services.PhotoService
import PhotoRepository = Repositories.PhotoRepository

export const makePhotoService = (repository: PhotoRepository, ErrorHandler: ErrorHandler): PhotoService => {
    const addPhoto = async (userId: number, fileId: number, ocrText: string) => {
        return await repository.addPhoto({
            userId,
            fileId,
            ocrText,
        })
    }

    const getPhotos = async (data: DTO.PhotoDTO) => {
        return await repository.getPhotos(data)
    }

    const getPhoto = async (id: number) => {
        return await repository.getPhoto(id)
    }

    const removePhoto = async (id: number) => {
        const res = await repository.removePhoto(id)
        return !!res
    }

    return {
        addPhoto,
        getPhotos,
        getPhoto,
        removePhoto,
    }
}
