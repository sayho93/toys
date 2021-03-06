import multer from 'multer'
import Config from '#configs/config'
import path from 'path'
import fs from 'fs'

const FileUtil = () => {
    const getExtension = (filename: string): string => {
        return filename.substring(filename.lastIndexOf('.') + 1)
    }

    const removeFile = async (path: string): Promise<void> => {
        await fs.unlink(path, err => {
            if (err) console.log(err)
        })
    }

    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, Config.app.UPLOAD_PATH)
        },
        filename: (req, file, callback) => {
            let extension = path.extname(file.originalname)
            let basename = path.basename(file.originalname, extension)
            callback(null, basename + '-' + Date.now() + extension)
        },
    })

    // const Multipart = multer({
    //     dest: Config.app.UPLOAD_PATH,
    // })
    const Multipart = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 15,
        },
    })

    return {
        getExtension,
        removeFile,
        Multipart,
    }
}

export default FileUtil()
