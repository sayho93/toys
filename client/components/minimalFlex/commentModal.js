const CommentModal = ({onClose, onSave, loading, comment, setComment}) => {
    return (
        <div className={`modal position-fixed d-block bg-secondary bg-opacity-50`} tabIndex="-1">
            <div className="modal-dialog modal-xl fixed-bottom">
                <div className="modal-content rounded-5 shadow">
                    <div className="modal-header  border-bottom-0">
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body pt-0">
                        <div className="input-group w-100">
                            <textarea
                                className="form-control"
                                placeholder="댓글 입력"
                                rows={2}
                                onChange={event => setComment({...comment, content: event.target.value})}
                            />
                            <button className="btn rounded-4 btn-primary btn-sm" onClick={onSave}>
                                {loading && <span className="spinner-border spinner-border-sm me-2" />}
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                textarea {
                    min-height: 1rem !important;
                }
            `}</style>
        </div>
    )
}

export default CommentModal
