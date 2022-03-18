import Task from 'components/planner/task'
import DateUtils from 'utils/date'
import Utils from 'utils/utils'

const Day = ({day, date, setDay, setDate, onTaskClick}) => {
    const style =
        (day.date.getMonth() !== date.getMonth() ? ' disabled' : '') +
        (DateUtils.sameDay(day.date, new Date()) ? ' current-day' : '') +
        (DateUtils.sameDay(day.date, date) ? ' selected-day' : '')

    const getStyle = color => {
        return {background: color, color: Utils.contrast(color)}
    }

    return (
        <>
            <div className={`day border border-1 border-white p-1 ${style}`} onClick={() => setDate(day.date)}>
                <div className="task-day">
                    <div className="row">
                        <h3 className="fs-3 text-end w-100"> {day.date.getDate()} </h3>
                    </div>
                    <div className="tasks flex-column">
                        {day.tasks.map(task => (
                            <Task key={task.id} task={task} onTaskClick={onTaskClick} setDay={setDay} style={getStyle(task.color)} />
                        ))}
                    </div>
                </div>
                {day && date && DateUtils.sameDay(day.date, date) ? (
                    <div className="btn btn-primary add-button" onClick={event => onTaskClick(event, {})}>
                        +
                    </div>
                ) : null}
            </div>
            <style jsx>{`
                .day {
                    min-height: 9vh;
                    text-align: center;
                    font-weight: bold;
                    cursor: pointer;
                }
                .disabled {
                    opacity: 0.5;
                }
                .current-day {
                    color: #e72f2f;
                }
                .selected-day {
                    background-color: #343634;
                }
                .tasks {
                    font-size: 11px;
                    word-break: break-all;
                }
            `}</style>
        </>
    )
}
export default Day
