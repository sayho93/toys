import Image from 'next/image'

const Card = ({data}) => {
    return (
        <>
            {data.filePath ? (
                <div className="card m-2">
                    <Image
                        className="bd-placeholder-img card-img-top"
                        src={data.filePath}
                        // objectFit="fill"
                        blurDataURL={data.blurDataURL}
                        layout="intrinsic"
                        width={data.width}
                        height={data.height}
                        alt=""
                    />

                    <div className="card-body">
                        <p className="card-text">{data.content}</p>
                        <figcaption className="blockquote-footer mb-0 text-muted">{data.author}</figcaption>
                    </div>
                    <style jsx>{`
                        //.imgWrapper {
                        //    display: inline-flex;
                        //    padding-top:'${100 / (data.width / data.height)}%;
                        //}
                    `}</style>
                </div>
            ) : (
                <div className="card p-3 m-2">
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
