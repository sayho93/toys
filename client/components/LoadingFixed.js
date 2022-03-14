const LoadingFixed = () => {
    return (
        <>
            <div className="position-fixed w-100 h-100 bg-secondary bg-opacity-25" style={{zIndex: 1010}} />
            <div className="position-fixed w-100 h-100" style={{zIndex: 1020, top: '45%'}}>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <style jsx>{`
                    .spinner-border {
                        width: 3rem;
                        height: 3rem;
                    }
                `}</style>
            </div>
        </>
    )
}

export default LoadingFixed
