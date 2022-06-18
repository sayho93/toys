import {Datasources} from '#types/datasources'
import MariaDBDataSource = Datasources.MariaDBDataSource
import PhotoRepository = Repositories.PhotoRepository

export const makePhotoRepository = (datasource: MariaDBDataSource): PhotoRepository => {
    const addPhoto = async (photo: DTO.PhotoDTO) => {
        const query = `
            INSERT INTO photo(userId, fileId, ocrText) VALUES (?, ?, ?)
        `
        const res = await datasource.exec(query, [photo.userId, photo.fileId, photo.ocrText, photo.regDate])
        return res.insertId
    }

    const getPhoto = async (id: number) => {
        const query = `
            SELECT P.*, F.originName, F.shortPath, F.width, F.height
            FROM photo P JOIN file F ON P.fileId = F.id 
            WHERE P.id = ?
            LIMIT 1
        `
        const [res] = await datasource.exec(query, [id])
        return res
    }

    const getPhotos = async (data: DTO.PhotoDTO) => {
        const search = data.searchTxt ? `(ocrText LIKE '%${data.searchTxt}%' OR fileName LIKE '%${data.searchTxt}%')` : '1=1'

        const query = `
            SELECT *
            FROM (
                SELECT P.*, F.originName AS fileName, F.shortPath AS filePath
                FROM photo P JOIN file F ON P.fileId = F.id
                WHERE P.userId = ?
            ) as tmp
            WHERE ${search}
            ORDER BY id DESC
            LIMIT ?, ?
        `

        if (!data.page) data.page = 1
        if (!data.limit) data.limit = 10

        return await datasource.exec(query, [data.userId, (+data.page - 1) * +data.limit, +data.limit])
    }

    const removePhoto = async (id: number) => {
        const res = await datasource.exec(`DELETE FROM photo WHERE id = ?`, [id])
        return res.affectedRows
    }

    return {
        addPhoto,
        getPhotos,
        getPhoto,
        removePhoto,
    }
}
