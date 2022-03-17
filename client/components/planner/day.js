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
            <div className={`day ${style}`} onClick={() => setDate(day.date)}>
                <div className="task-day">
                    <div className="row">
                        <h3> {day.date.getDate()} </h3>
                    </div>
                    <div className="tasks">
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
                    min-height: 10vh;
                    padding: 5px;
                    text-align: center;
                    font-weight: bold;
                    border-top: 2px solid #e7e7e7;
                    border-right: 2px solid #e7e7e7;
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
                .task-day {
                    //display: flex;
                    gap: 10px;
                }
                .task-day h3 {
                    flex: 1;
                    text-align: right;
                    width: 100%;
                    font-size: 1.5rem;
                    margin-top: 0;
                }
                .tasks {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    font-size: 12px;
                }

                .tasks p {
                    text-align: left;
                    margin: 1px 0;
                    padding: 5px;
                    border-radius: 5px;
                    cursor: pointer;
                }
            `}</style>
        </>
    )
}
export default Day
