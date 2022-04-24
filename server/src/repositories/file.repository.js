const FileRepository = dataSource => {
    const addFile = async ({userId = 0, originName, path, shortPath, size, width, height, ext, desc = ''}) => {
        const query = `INSERT INTO file(userId, originName, path, shortPath, size, width, height, ext, \`desc\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const [res] = await dataSource.exec(query, [userId, originName, path, shortPath, size, width, height, ext, desc])
        return res.insertId
    }

    const getFile = async ({id}) => {
        const query = `SELECT * FROM file WHERE id = ?`
        const [res] = await dataSource.exec(query, [id])
        return res
    }

    const removeFile = async ({id}) => {
        const query = `UPDATE file SET status = 0 WHERE id = ?`
        const [res] = await dataSource.exec(query, [id])
        return res.affectedRows > 0
    }

    return {addFile, getFile, removeFile}
}

export default FileRepository
