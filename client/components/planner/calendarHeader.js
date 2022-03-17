const CalendarHeader = ({date, setDate}) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const addMonth = value => setDate(new Date(date.setMonth(date.getMonth() + value)))

    return (
        <header>
            <div className="month">
                <h1>
                    {monthNames[date.getMonth()]} {date.getFullYear()}
                </h1>
            </div>
            <div>
                <button className="button button-white" onClick={() => addMonth(-1)}>
                    <svg width="52px" height="52px" viewBox="0 0 52 52" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                        <g data-name="Group 132" id="Group_132">
                            <path d="M38,52a2,2,0,0,1-1.41-.59l-24-24a2,2,0,0,1,0-2.82l24-24a2,2,0,0,1,2.82,0,2,2,0,0,1,0,2.82L16.83,26,39.41,48.59A2,2,0,0,1,38,52Z" />
                        </g>
                    </svg>
                </button>
                <button className="button button-white" onClick={() => setDate(new Date())}>
                    Today
                </button>
                <button className="button button-white" onClick={() => addMonth(1)}>
                    <svg width="52px" height="52px" viewBox="0 0 52 52" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                        <g data-name="Group 132" id="Group_132">
                            <path d="M14,52a2,2,0,0,1-1.41-3.41L35.17,26,12.59,3.41a2,2,0,0,1,0-2.82,2,2,0,0,1,2.82,0l24,24a2,2,0,0,1,0,2.82l-24,24A2,2,0,0,1,14,52Z" />
                        </g>
                    </svg>
                </button>
            </div>

            <style jsx>{`
                header {
                    display: flex;
                    text-align: left;
                    margin-bottom: 20px;
                }
                header h1 {
                    font-weight: bold;
                    margin: 0;
                }
                .month {
                    flex: 1;
                }
                .nav {
                    flex: 0;
                    display: flex;
                    align-items: center;
                }
                .button svg {
                    width: 18px;
                    height: auto;
                    display: flex;
                }

                .button {
                    background-color: #4caf50; /* Green */
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 4px 2px;
                    transition-duration: 0.4s;
                    cursor: pointer;
                    border-radius: 5px;
                }
                .button-white {
                    background-color: white;
                    color: black;
                    border: 2px solid #e7e7e7;
                }

                .button-white:hover {
                    background-color: #e7e7e7;
                }
            `}</style>
        </header>
    )
}

export default CalendarHeader
