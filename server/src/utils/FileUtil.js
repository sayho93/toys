import multer from 'multer'
import Config from 'src/config/Config'
const FileUtil = {
    getExtension: filename => {
        return filename.substring(filename.lastIndexOf('.') + 1)
    },
}

const Multipart = multer({
    dest: Config.app.UPLOAD_PATH,
})

export {FileUtil, Multipart}
