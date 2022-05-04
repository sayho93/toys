import path from 'path'
import slash from 'slash'
import sizeOf from 'image-size'
import Config from '#configs/config'

const FileService = ({FileRepository, FileUtil}) => {
    const processFile = async (userId, file, desc) => {
        console.log(file)
        if (file === undefined) {
            const err = new Error('file is required')
            err.status = 401
            throw err
        }

        const dimensions = sizeOf(file.path)
        let ext = FileUtil.getExtension(file.originalname)
        return await FileRepository.addFile({
            userId,
            originName: file.originalname,
            path: slash(file.path),
            shortPath: slash(path.join(Config.app.EXTERNAL_PATH, file.filename)),
            size: file.size,
            width: dimensions.width,
            height: dimensions.height,
            ext: ext,
            desc: desc,
        })
    }

    const removeFile = async id => {
        const file = await FileRepository.getFile({id})
        console.log(file)
        if (file.length) {
            await FileUtil.removeFile(file[0].path)
            return await FileRepository.removeFile({id})
        } else return false
    }

    const getFile = async id => {
        const [file] = await FileRepository.getFile({id})
        if (!file) return false
        return file
    }

    return {
        processFile,
        removeFile,
        getFile,
    }
}

export default FileService
