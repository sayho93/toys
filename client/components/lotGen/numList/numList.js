import dateUtils from 'utils/date'

const NumList = props => {
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
                <div className="row g-3 py-5 row-cols-1 row-cols-lg-3 row-cols-md-2">
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
                {props.list && props.list[0].length > 0 ? (
                    <button
                        className="btn btn-outline-secondary w-100 mb-5"
                        onClick={() => {
                            if (props.list.length !== props.size || props.list[props.list.length - 1].length !== 12) {
                                alert('더이상 불러올 데이터가 없습니다.')
                            } else props.setSize(props.size + 1)
                        }}
                    >
                        Load More
                    </button>
                ) : (
                    <p className="text-center">데이터가 없습니다...</p>
                )}
            </div>
        </>
    )
}
export default NumList
