const Task = ({task, setTask, style}) => {
    return (
        <p
            style={style}
            onClick={() => {
                setTask(task)
            }}
        >
            {task.content}
        </p>
    )
}
export default Task
