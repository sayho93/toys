const Task = ({task, onTaskClick, style}) => {
    return (
        <p style={style} onClick={event => onTaskClick(event, task)}>
            {task.title}
        </p>
    )
}
export default Task
