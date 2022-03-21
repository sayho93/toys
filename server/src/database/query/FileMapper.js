const FileMapper = dataSource => {
    const addFile = async ({userId = 0, originName, path, shortPath, size, width, height, ext, desc = ''}) => {
        const query = `INSERT INTO file(userId, originName, path, shortPath, size, width, height, ext, \`desc\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const [res] = await dataSource.exec(query, [userId, originName, path, shortPath, size, width, height, ext, desc])
        return res.insertId
    }

    return {addFile}
}

export default FileMapper
