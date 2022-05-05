import fs from 'fs'
import Log from '#utils/logger'
import path from 'path'

const FileController = ({FileService}) => {
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

    const downloadSingleFile = async (req, res) => {
        const id = +req.params.id
        const file = await FileService.getFile(id)
        if (!file) return res.status(404).send('File not found')

        const data = fs
            .createReadStream(path.resolve(file.path))
            .on('open', () => {
                setTimeout(() => data.emit('error', new Error('timeout')), 0)
                console.log('open')
            })
            .on('close', () => {
                Log.info('done!')
            })
            .on('error', err => {
                Log.error(err.code)
                Log.error(err.stack)
                res.status(500).send('Internal server error')
            })
        const disposition = 'attachment; filename="' + file.name + '"'

        res.setHeader('Content-Type', 'image' + '/' + file.ext)
        res.setHeader('Content-Disposition', disposition)

        data.pipe(res)
    }

    return {
        uploadSingleFile,
        removeSingleFile,
        downloadSingleFile,
    }
}

export default FileController
