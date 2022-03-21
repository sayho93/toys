import {useEffect} from 'react'
import {FilePond, registerPlugin} from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import Constants from 'api/Constants'

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const WriteModal = ({loading, info, setInfo, onSave, onClose}) => {
    useEffect(() => {
        const enterHandler = event => {
            if (event.key === 'Enter') {
                event.preventDefault()
                onSave()
            }
        }

        document.addEventListener('keydown', enterHandler)
        return () => document.removeEventListener('keydown', enterHandler)
    }, [])

    const inputHandler = event => {
        setInfo({...info, [event.target.name]: event.target.value})
    }

    const fileHandler = fileItem => {
        if (!fileItem.length) setInfo({...info, fileId: 0})
    }

    const processHandler = (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
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
        <div className={`modal position-fixed d-block bg-secondary bg-opacity-50`} tabIndex="-1" id="modalSignIn">
            <div className="modal-dialog">
                <div className="modal-content rounded-5 shadow">
                    <div className="modal-header p-5 pb-4 border-bottom-0">
                        <h3 className="fw-bold mb-0">새 게시물</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
                    </div>

                    <div className="modal-body p-5 pt-0">
                        <FilePond
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

                        <div className="form-floating mb-3">
                            <textarea
                                className="form-control"
                                placeholder="상세 내용"
                                name="content"
                                id="floatingTextarea"
                                rows={50}
                                onChange={inputHandler}
                                value={info.content ? info.content : ''}
                            />
                            <label htmlFor="floatingTextarea">상세 내용</label>
                        </div>
                        <button className="w-100 mb-2 btn btn-lg rounded-4 btn-primary btn-sm" onClick={onSave}>
                            {loading && <span className="spinner-border spinner-border-sm me-2" />}
                            저장
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                textarea {
                    min-height: 15rem !important;
                }
            `}</style>
        </div>
    )
}

export default WriteModal
