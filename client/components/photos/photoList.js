import {getDateString, parseDateString} from 'utils/date'
import {toast, ToastContainer} from 'react-toastify'
import {Fragment, useCallback, useEffect, useRef} from 'react'

const PhotoList = props => {
    const loader = useRef(null)

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '10px',
            threshold: 0.25,
        }
        const observer = new IntersectionObserver(observerHandler, option)
        if (loader.current) observer.observe(loader.current)
        return () => observer.disconnect()
    }, [props.list])

    const observerHandler = useCallback(
        entries => {
            const target = entries[0]
            if (target.isIntersecting) {
                if (props.list && props.list[0].length && props.list[0].length === 10) {
                    if (props.list[props.list.length - 1].length !== 27) toast.success('더이상 불러올 데이터가 없습니다.')
                    else props.setSize(props.size + 1)
                }
            }
        },
        [props.list]
    )

    const renderPhotoList = list => {
        let last = null

        return list.map(row => {
            const [year, month] = parseDateString(row.regDate)
            const flagStr = `${year}-${month}`

            let separator = null
            if (last !== flagStr) {
                separator = (
                    <>
                        <div className="separator" key={last}>
                            {year}년 {month}월
                        </div>
                        <hr />
                    </>
                )
                last = flagStr
            }

            const rowItem = (
                <div className="btn btn-dark" onClick={() => props.onClick(row.id)}>
                    <div className="rounded-3 py-3 px-2 text-white">
                        <div className="d-flex w-100 justify-content-between mb-2">
                            <h6 className="mb-1">
                                {row.fileName}
                                {row.ocrText && <span className="badge bg-warning ms-2">OCR</span>}
                            </h6>
                            <small className="text-sm-end">{getDateString(row.regDate)}</small>
                        </div>
                    </div>
                </div>
            )

            return (
                <Fragment key={row.id}>
                    {separator}
                    {rowItem}
                </Fragment>
            )
        })
    }

    return (
        <>
            <div className={`align-items-center justify-content-center`}>
                <div className="row g-3 pb-2">{props.list && props.list.map(subList => renderPhotoList(subList))}</div>
                <ToastContainer
                    position="bottom-center"
                    autoClose={2000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                    closeButton={false}
                    style={{textAlign: 'center', fontSize: '0.8rem'}}
                    theme="dark"
                    limit={3}
                />
                <div className="w-100 mb-3 observerRef" ref={loader} />
                <style jsx>{`
                    .observerRef {
                        height: 1rem;
                    }
                `}</style>

                {(!props.list || !props.list[0].length) && <p className="text-center">데이터가 없습니다...</p>}
            </div>
        </>
    )
}

export default PhotoList
