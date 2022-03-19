import path from 'path'
import slash from 'slash'

class FileSVC {
    constructor({Config, Mappers, Utils, Log, MailSender, PushManager, FileUtil}) {
        this.Config = Config
        this.Mappers = Mappers
        this.Utils = Utils
        this.Log = Log
        this.MailSender = MailSender
        this.PushManager = PushManager
        this.FileUtil = FileUtil
    }

    async processFile(userId, file, desc) {
        let ext = this.FileUtil.getExtension(file.originalname)
        return await this.Mappers.fileMapper.addFile({
            userId,
            originName: file.originalname,
            path: slash(file.path),
            shortPath: slash(path.join(this.Config.app.EXTERNAL_PATH, file.filename)),
            size: file.size,
            ext: ext,
            desc: desc,
        })
    }
}

export default FileSVC
