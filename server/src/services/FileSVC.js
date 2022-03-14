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

        // const res = await Models.fileModel.create({
        //     originName: file.originalname,
        //     path: slash(file.path),
        //     shortPath: slash(path.join(Config.app.EXTERNAL_PATH, file.filename)),
        //     size: file.size,
        //     ext: ext,
        //     userKey: userId,
        //     desc: desc,
        // })
        // this.Log.warn(JSON.stringify(res))
        // return Models.fileModel.findByPk(res.id)
    }
}

export default FileSVC

// const FileSVC = {
//     processFile: async (userId, file, desc) => {
//         let ext = fileUtil.getExtension(file.originalname)
//
//         const res = await Models.fileModel.create({
//             originName: file.originalname,
//             path: slash(file.path),
//             shortPath: slash(path.join(Config.app.EXTERNAL_PATH, file.filename)),
//             size: file.size,
//             ext: ext,
//             userKey: userId,
//             desc: desc,
//         })
//         Log.warn(JSON.stringify(res))
//         return Models.fileModel.findByPk(res.id)
//     },
// }
//
// export default FileSVC
