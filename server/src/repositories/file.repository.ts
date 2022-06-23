import {Datasources} from '#types/datasources'
import FileRepository = Repositories.FileRepository
import MariaDBDataSource = Datasources.MariaDBDataSource

export const makeFileRepository = (datasource: MariaDBDataSource): FileRepository => {
    const addFile = async (file: DTO.FileDTO) => {
        const query = `INSERT INTO file(userId, originName, path, shortPath, size, width, height, ext, \`desc\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const res = await datasource.exec(query, [file.userId, file.originName, file.path, file.shortPath, file.size, file.width, file.height, file.ext, file.desc])
        return res.insertId
    }

    const getFile = async (id: number) => {
        const query = `SELECT * FROM file WHERE id = ?`
        const [res] = await datasource.exec(query, [id])
        return res
    }

    const removeFile = async (id: number) => {
        const query = `UPDATE file SET status = 0 WHERE id = ?`
        const res = await datasource.exec(query, [id])
        return res.affectedRows > 0
    }

    return {
        addFile,
        getFile,
        removeFile,
    }
}
