import Constants from 'api/Constants'
import Image from 'next/image'
import {getDateString} from 'utils/date'

const ArticleView = ({data, onLike, onComment}) => {
    console.log(data)
    return (
        <div>
            <div className="text-center">
                {data.shortPath && (
                    <Image
                        className="bd-placeholder-img card-img-top"
                        src={`${Constants.URL}${data.shortPath}`}
                        blurDataURL="/static/images/imgPlaceholder.png"
                        layout="intrinsic"
                        width={data.width}
                        height={data.height}
                        alt=""
                    />
                )}
            </div>
            <div className="d-flex p-1">
                <i className="bi bi-heart me-3" onClick={onLike} />
                <i className="bi bi-chat" onClick={() => onComment()} />
                <p className="w-100 text-end">{getDateString(data.regDate)}</p>
            </div>
            <div className="row">
                <p>{data.content}</p>
            </div>
        </div>
    )
}

export default ArticleView
