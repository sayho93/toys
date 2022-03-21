import path from 'path'
import slash from 'slash'
import sizeOf from 'image-size'

class FileSVC {
    constructor({Config, Mappers, Utils, Log, FileUtil}) {
        this.Config = Config
        this.Mappers = Mappers
        this.Utils = Utils
        this.Log = Log
        this.FileUtil = FileUtil
    }

    async processFile(userId, file, desc) {
        const dimensions = sizeOf(file.path)
        let ext = this.FileUtil.getExtension(file.originalname)
        return await this.Mappers.fileMapper.addFile({
            userId,
            originName: file.originalname,
            path: slash(file.path),
            shortPath: slash(path.join(this.Config.app.EXTERNAL_PATH, file.filename)),
            size: file.size,
            width: dimensions.width,
            height: dimensions.height,
            ext: ext,
            desc: desc,
        })
    }

    async removeFile(id) {
        const file = await this.Mappers.fileMapper.getFile({id})
        console.log(file)
        if (file.length) {
            await this.FileUtil.removeFile(file[0].path)
            return await this.Mappers.fileMapper.removeFile({id})
        } else return false
    }
}

export default FileSVC
