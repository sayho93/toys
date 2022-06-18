import Constants from 'api/Constants'
import Image from 'next/image'

const DetailModal = props => {
    const onClose = () => {
        props.setDetailId(null)
        props.setDetail(null)
    }

    const loader = ({src}) => {
        return `${Constants.URL}${src}`
    }
    return (
        <>
            <div className={`modal position-fixed d-block bg-secondary bg-opacity-50`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content rounded-5 shadow">
                        {props.detail && (
                            <>
                                <div className="modal-header p-5 pb-4 border-bottom-0">
                                    <h3 className="fw-bold mb-0">{props.detail.originName}</h3>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
                                </div>
                                <div className="modal-body p-5 pt-0">
                                    <Image
                                        loader={loader}
                                        src={props.detail.shortPath}
                                        blurDataURL="/static/images/imgPlaceholder.png"
                                        layout="intrinsic"
                                        width={props.detail.width}
                                        height={props.detail.height}
                                        alt=""
                                    />
                                    <div className="form-floating mb-3">
                                        <pre>{props.detail.ocrText}</pre>
                                    </div>
                                    <button className="w-100 mb-2 btn btn-lg rounded-4 btn-primary btn-sm" onClick={onClose}>
                                        닫기
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <style jsx>{`
                    textarea {
                        min-height: 15rem !important;
                    }
                `}</style>
            </div>
        </>
    )
}

export default DetailModal
