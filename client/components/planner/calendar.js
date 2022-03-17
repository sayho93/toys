import Day from 'components/planner/day'

const Calendar = ({days, date, setDate, onTaskClick}) => {
    const names = ['월', '화', '수', '목', '금', '토', '일']

    return (
        <div>
            <div className="calendar borderless day-names">
                {names.map(name => (
                    <h5 key={name}>{name}</h5>
                ))}
            </div>
            <div className="calendar">{days.length && days.map(item => <Day key={item.date} day={item} date={date} setDate={setDate} onTaskClick={onTaskClick} />)}</div>
            <style jsx>{`
                .calendar {
                    box-sizing: border-box;
                    display: grid;
                    grid-template-columns: repeat(7, minmax(8px, 1fr));
                    color: white;
                }
                .calendar h5 {
                    text-align: right;
                    font-weight: bold;
                    color: #ffffff;
                    padding: 5px 10px 5px 10px;
                    margin: 0;
                    border-radius: 5px;
                }
                .borderless {
                    border: 0;
                }
                .day-names {
                    font-size: 20px;
                }
            `}</style>
        </div>
    )
}

export default Calendar
