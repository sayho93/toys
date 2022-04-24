const FileController = FileService => {
    const uploadSingleFile = async (req, res) => {
        let userId = req.body.userId
        let desc = req.body.desc
        let file = req.file
        const ret = await FileService.processFile(userId, file, desc)
        res.header('Access-Control-Allow-Origin', '*')
        res.json(ret)
    }

    const removeSingleFile = async (req, res) => {
        const id = +req.body
        const ret = await FileService.removeFile(id)
        res.header('Access-Control-Allow-Origin', '*')
        res.json(ret)
    }

    return {
        uploadSingleFile,
        removeSingleFile,
    }
}

export default FileController
