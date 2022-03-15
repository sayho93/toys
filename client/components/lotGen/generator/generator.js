import styles from './generator.module.css'

const Generator = props => {
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
                                            className={`form-control ${styles.lotNumber}`}
                                            data-idx={idx}
                                            value={props.numList ? props.numList[idx] : ''}
                                            onChange={props.onChange}
                                        />
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
                        <button className="btn btn-primary ms-4" onClick={props.onGenerate} disabled={props.disabled}>
                            번호 생성!
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Generator
