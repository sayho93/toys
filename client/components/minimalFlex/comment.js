import {getDateString} from 'utils/date'

const Comment = ({data, onComment}) => {
    const onCommentClick = event => {
        event.preventDefault()
        onComment(data.id)
    }

    return (
        <div className="list-group-item n d-flex gap-3 py-3 border-0">
            <img src="/static/images/defaultUser.png" alt="user" width="32" height="32" className={`rounded-circle flex-shrink-0 ${data.depth > 0 && 'ms-5'}`} />
            <div className="d-flex gap-2 w-100 justify-content-between">
                <div>
                    <h6 className="mb-0">{data.name}</h6>
                    <p className="mb-0 opacity-75">{data.content}</p>
                    <small className="opacity-50 text-nowrap me-2">{getDateString(data.regDate)}</small>
                    {data.depth === 0 && (
                        <a href="#" className="text-muted text-decoration-underline muted" onClick={onCommentClick}>
                            답글달기
                        </a>
                    )}
                </div>
            </div>
            <style jsx>{`
                .muted {
                    font-size: 0.8rem;
                }
            `}</style>
        </div>
    )
}
export default Comment
