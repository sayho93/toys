import dateUtils from 'utils/date'
import {useCallback, useEffect, useRef} from 'react'
import {ToastContainer, toast} from 'react-toastify'

const NumList = props => {
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
                if (props.list && props.list[0].length && props.list[0].length === 15) {
                    if (props.list[props.list.length - 1].length !== 15) toast('더이상 불러올 데이터가 없습니다.')
                    else props.setSize(props.size + 1)
                }
            }
        },
        [props.list]
    )

    const renderNumbers = (num, row) => {
        const corrects = row.correctCSV ? row.correctCSV.split(',') : []

        let tag = corrects.includes(num) ? 'bg-success' : 'bg-secondary'
        if (row.rank === 2 && +num === row.bonusNo) tag = 'bg-warning'
        return (
            <span key={num} className={`badge rounded-pill ${tag} me-2`}>
                {num}
            </span>
        )
    }

    return (
        <>
            <div className={`align-items-center justify-content-center`}>
                <div className="row g-3 pt-5 pb-2 row-cols-1 row-cols-lg-3 row-cols-md-2">
                    {props.list &&
                        props.list.map(subList => {
                            return subList.map(row => (
                                <div key={row.id} className="col">
                                    <div
                                        className={`
                                            rounded-3 py-3 px-2 bg-gradient shadow-lg
                                            ${row.rank !== 0 ? 'bg-primary text-white' : ''} 
                                            ${row.isProcessed && !row.rank ? 'bg-danger bg-opacity-50' : ''}
                                        `}
                                    >
                                        <div className="d-flex w-100 justify-content-between mb-2">
                                            <h6 className="mb-1">{row.roundNo}회</h6>
                                            <small className="text-sm-end">{dateUtils.getDateString(row.regDate)}</small>
                                        </div>
                                        <div className="mb-2">{row.numberCSV.split(',').map(num => renderNumbers(num, row))}</div>
                                        {row.rank !== 0 ? (
                                            <p className="mb-1">{`${row.rank}등 당첨!`}</p>
                                        ) : row.isProcessed ? (
                                            <p className="mb-1">{`미당첨`}</p>
                                        ) : (
                                            <p className="mb-1">{`미추첨`}</p>
                                        )}
                                        <small>{`${row.userName} <${row.email}>`}</small>
                                    </div>
                                </div>
                            ))
                        })}
                </div>
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
export default NumList
