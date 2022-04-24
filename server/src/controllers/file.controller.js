const FileController = FileService => {
    const uploadSingleFile = async (req, res) => {
        let userId = req.body.userId
        let desc = req.body.desc
        let file = req.file
        console.log(file)
        if (file === undefined) {
            const err = new Error('file is required')
            err.status = 400
            throw err
        }
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
