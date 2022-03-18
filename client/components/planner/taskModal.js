import {useEffect} from 'react'
import {CirclePicker} from 'react-color'
import {getDateString} from 'utils/date'

const TaskModal = ({date, task, setTask, setModal, onSave, onDelete, loading, user}) => {
    useEffect(() => {
        if (task && !task.id) setTask({...task, targetDate: getDateString(date), color: '#f44336'})
        else setTask({...task, targetDate: getDateString(task.targetDate)})
    }, [date])

    const inputHandler = e => {
        setTask({...task, [e.target.name]: e.target.value})
    }

    const setColor = color => {
        setTask({...task, color})
    }

    const onClose = () => {
        setModal(false)
        setTask({})
    }

    return (
        <>
            <div className={`modal modal-signin position-fixed d-block bg-secondary bg-opacity-50`} tabIndex="-1" id="modalSignIn">
                <div className="modal-dialog">
                    <div className="modal-content rounded-5 shadow">
                        <div className="modal-header pb-4 border-bottom-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
                        </div>

                        <div className="modal-body p-5 pt-0">
                            {task.name && <label className="mb-3">작성자: {task.name}</label>}

                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control rounded-4"
                                    name="title"
                                    placeholder="제목"
                                    value={task.title ? task.title : ''}
                                    onChange={inputHandler}
                                />
                                <label htmlFor="floatingInput">제목</label>
                            </div>
                            <div className="form-floating mb-3">
                                <textarea
                                    className="form-control"
                                    placeholder="상세 내용"
                                    name="content"
                                    id="floatingTextarea"
                                    rows={50}
                                    onChange={inputHandler}
                                    value={task.content ? task.content : ''}
                                />
                                <label htmlFor="floatingTextarea">상세 내용</label>
                            </div>

                            <label>Color</label>

                            <div className="mb-4 mt-2 colorPicker justify-content-center d-flex">
                                <CirclePicker
                                    color={task.color}
                                    onChange={color => {
                                        setColor(color.hex)
                                    }}
                                />
                            </div>

                            <div className="btn-group w-100">
                                {(!task.id || task.userId === user.id) && (
                                    <button className="w-100 mb-2 btn btn-lg rounded-4 btn-primary btn-sm" onClick={onSave}>
                                        {loading.save && <span className="spinner-border spinner-border-sm me-2" />}
                                        저장
                                    </button>
                                )}

                                <button className="w-100 mb-2 btn btn-lg rounded-4 btn-warning btn-sm text-white" onClick={onClose}>
                                    취소
                                </button>
                            </div>

                            {task && task.id && task.userId === user.id && (
                                <button className="w-100 mb-2 btn btn-lg rounded-4 btn-danger btn-sm" onClick={onDelete}>
                                    {loading.delete && <span className="spinner-border spinner-border-sm me-2" />}
                                    삭제
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                textarea {
                    min-height: 12rem !important;
                }
            `}</style>
        </>
    )
}

export default TaskModal
