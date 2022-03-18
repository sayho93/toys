import Day from 'components/planner/day'

const Calendar = ({days, date, setDate, onTaskClick}) => {
    const names = ['월', '화', '수', '목', '금', '토', '일']

    return (
        <div>
            <div className="calendar borderless day-names">
                {names.map(name => (
                    <h5 className="text-end fw-bold px-1 py-2 m-0" key={name}>
                        {name}
                    </h5>
                ))}
            </div>
            <div className="calendar">
                {days.length !== 0 && days.map(item => <Day key={item.date} day={item} date={date} setDate={setDate} onTaskClick={onTaskClick} />)}
            </div>
            <style jsx>{`
                .calendar {
                    box-sizing: border-box;
                    display: grid;
                    grid-template-columns: repeat(7, minmax(8px, 1fr));
                    color: white;
                }
                .calendar h5 {
                    color: #ffffff;
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
