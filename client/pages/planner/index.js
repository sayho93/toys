import Container from 'components/planner/container'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import Constants from 'api/Constants'
import Helper from 'api/Helper'
import CalendarHeader from 'components/planner/calendarHeader'
import Calendar from 'components/planner/calendar'
import DateUtils from 'utils/date'

const PlannerApp = () => {
    const [date, setDate] = useState(new Date())
    const [days, setDays] = useState([])
    const [task, setTask] = useState([])
    const {data, error, isValidating, mutate} = useSWR(Constants.API_PLANNER_LIST, Helper.get)

    useEffect(() => {
        console.log(date)
    }, [date])

    useEffect(() => {
        console.log(days)
    }, [days])

    useEffect(() => {
        if (data) {
            const tmpDays = []
            const first = DateUtils.getCalendarFirstDay(date)
            const last = DateUtils.getCalendarLastDay(date)

            do {
                first.setDate(first.getDate() + 1)
                tmpDays.push({
                    date: new Date(first.getTime()),
                    tasks: data.filter(task => DateUtils.sameDay(first, new Date(task.targetDate))),
                })
            } while (!DateUtils.sameDay(first, last))

            setDays(tmpDays)
            // console.log(first, last)
            // console.log(tmpDays)
        }
    }, [data, date])

    return (
        <Container>
            <CalendarHeader date={date} setDate={setDate} />
            <Calendar days={days} date={date} setDate={setDate} setTask={setTask} />
        </Container>
    )
}

export default PlannerApp
