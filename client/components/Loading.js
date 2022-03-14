const Loading = () => {
    return (
        <div className="w-100 text-center mt-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <style jsx>{`
                .spinner-border {
                    width: 3rem;
                    height: 3rem;
                }
            `}</style>
        </div>
    )
}

export default Loading
