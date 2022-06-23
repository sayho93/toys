import Constants from 'api/Constants'
import {FilePond, registerPlugin} from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImagePreview)

const Uploader = ({file, setFile, info, setInfo, onOCR, onSave, loading, ocrLoading, ocrText, setOcrText}) => {
    const fileHandler = fileItem => {
        if (!fileItem.length) setInfo({...info, fileId: 0})
    }

    const processHandler = (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
        setFile([file])
        const formData = new FormData()
        formData.append(fieldName, file, file.name)
        console.log(formData)

        const request = new XMLHttpRequest()
        request.open('POST', Constants.API_FILE_UPLOAD_SINGLE)

        request.upload.onprogress = e => {
            progress(e.lengthComputable, e.loaded, e.total)
        }

        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
                load(request.responseText)
                setInfo({...info, fileId: +request.responseText})
                setFile([file])
            } else error('error occured during upload')
        }

        request.send(formData)

        return {
            abort: () => {
                request.abort()
                abort()
            },
        }
    }

    return (
        <>
            <div className="row g-3 text-center align-items-center justify-content-center mb-2">
                <FilePond
                    files={file}
                    allowFileTypeValidation={true}
                    acceptedFileTypes={['image/jpg', 'image/jpeg', 'image/png']}
                    allowMultiple={false}
                    name="img"
                    server={{
                        process: processHandler,
                        revert: Constants.API_FILE_REMOVE_SINGLE,
                    }}
                    onupdatefiles={fileHandler}
                />
                {ocrText && (
                    <textarea className="form-control" placeholder="OCR 텍스트 입력" rows={10} onChange={event => setOcrText(event.target.value)} value={ocrText} />
                )}
                <div>
                    <button className="btn btn-primary" onClick={onOCR} disabled={ocrLoading}>
                        {ocrLoading && <span className="spinner-border spinner-border-sm me-2" />}
                        OCR
                    </button>
                    <button className="btn btn-outline-warning ms-2" onClick={onSave} disabled={loading}>
                        {loading && <span className="spinner-border spinner-border-sm me-2" />}
                        저장
                    </button>
                </div>
            </div>
        </>
    )
}

export default Uploader
