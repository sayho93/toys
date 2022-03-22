import Image from 'next/image'
import Constants from 'api/Constants'

const Card = ({data, onClick}) => {
    if (!data) return null
    else
        return (
            <>
                {data.shortPath ? (
                    <div className="card m-2" onClick={() => onClick(data.id)}>
                        <Image
                            className="bd-placeholder-img card-img-top"
                            src={`${Constants.URL}${data.shortPath}`}
                            blurDataURL="/static/images/imgPlaceholder.png"
                            layout="intrinsic"
                            width={data.width}
                            height={data.height}
                            alt=""
                        />

                        <div className="card-body">
                            <p className="card-text">{data.content}</p>
                            <figcaption className="blockquote-footer mb-0 text-muted">{data.author}</figcaption>
                        </div>
                    </div>
                ) : (
                    <div className="card p-3 m-2" onClick={() => onClick(data.id)}>
                        <figure className="p-3 mb-0">
                            <blockquote className="blockquote">
                                <p>{data.content}</p>
                            </blockquote>
                            <figcaption className="blockquote-footer mb-0 text-muted">{data.author}</figcaption>
                        </figure>
                    </div>
                )}
            </>
        )
}
export default Card
