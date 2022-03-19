const Generator = props => {
    // const onUploadClick = () => {
    //     inputFileRef.current.dispatchEvent(new Event('click', {bubbles: true}))
    // }
    const urlHandler = event => props.setUrl(event.target.value)

    return (
        <>
            <div className="mb-3 text-center">
                <span className="user-select-none">
                    다음 회차는 <b className="text-primary">{props.week}</b> 회
                </span>
            </div>

            <div className="row g-3 text-center align-items-center justify-content-center mb-2">
                <div className="col-md-7 col-lg-4">
                    <div className="row text-center">
                        {Array(6)
                            .fill(0)
                            .map((_, idx) => {
                                return (
                                    <div className="col-2 px-1" key={idx}>
                                        <input
                                            type="text"
                                            pattern="\d*"
                                            className={`form-control lotNumber`}
                                            data-idx={idx}
                                            value={props.numList ? props.numList[idx] : ''}
                                            onChange={props.onChange}
                                        />
                                        <style jsx>{`
                                            .lotNumber {
                                                font-size: 1em !important;
                                                font-weight: bold;
                                                text-align: center;
                                                padding: 0.375rem 0.35rem;
                                                border-radius: 0.5em;
                                            }
                                        `}</style>
                                    </div>
                                )
                            })}
                    </div>
                </div>
                <div className="col-md-5 col-lg-4">
                    <div>
                        <button className="btn btn-outline-warning" onClick={props.onSave} disabled={props.disabled}>
                            {props.loading && <span className="spinner-border spinner-border-sm me-2" />}
                            저장
                        </button>
                        <button className="btn btn-primary ms-2" onClick={props.onGenerate} disabled={props.disabled}>
                            번호 생성!
                        </button>
                        <button className="btn btn-secondary ms-2" onClick={() => props.setShowUrl(!props.showUrl)}>
                            QR URL
                        </button>
                    </div>
                </div>
                {props.showUrl && (
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon3">
                            QR code URL
                        </span>
                        <input type="text" className="form-control" id="url" onChange={urlHandler} value={props.url} />
                        <button className="btn btn-outline-secondary" type="button" onClick={props.onUrlSave} disabled={props.urlSaveLoading}>
                            {props.urlSaveLoading && <span className="spinner-border spinner-border-sm me-2" />}
                            저장
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default Generator
