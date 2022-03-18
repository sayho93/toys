import Container from 'components/planner/container'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import Constants from 'api/Constants'
import Helper from 'api/Helper'
import CalendarHeader from 'components/planner/calendarHeader'
import Calendar from 'components/planner/calendar'
import DateUtils from 'utils/date'
import TaskModal from 'components/planner/taskModal'
import useUser from '../../lib/useUser'

const PlannerApp = () => {
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(false)
    const [date, setDate] = useState(new Date())
    const [days, setDays] = useState([])
    const [task, setTask] = useState({})
    const {user, mutateUser} = useUser({})
    const {data, error, isValidating, mutate} = useSWR(Constants.API_PLANNER_LIST, Helper.get)

    useEffect(async () => {
        if (user) {
            await Helper.get(`${Constants.API_USER_NOTIFIED}/${user.id}`)
            mutateUser()
        }

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
        }
    }, [data, date])

    const onTaskClick = (event, task) => {
        event.preventDefault()
        event.stopPropagation()
        setTask(task)
        setModal(true)
    }

    const onSave = async () => {
        setLoading(true)
        const ret = await Helper.post(Constants.API_PLANNER_SAVE, {...task, userId: user.id})
        if (ret) {
            await mutate()
            setLoading(false)
            setModal(false)
            setTask({})
        }
    }

    const onDelete = async () => {
        setLoading(true)
        const ret = await Helper.get(`${Constants.API_PLANNER_DELETE}/${task.id}`)
        if (ret) {
            await mutate()
            setLoading(false)
            setModal(false)
            setTask({})
        }
    }

    return (
        <Container>
            {modal && <TaskModal date={date} task={task} setTask={setTask} setModal={setModal} loading={loading} onSave={onSave} onDelete={onDelete} user={user} />}
            {user && user.id ? (
                <>
                    <CalendarHeader date={date} setDate={setDate} />
                    <Calendar days={days} date={date} setDate={setDate} onTaskClick={onTaskClick} />
                </>
            ) : (
                <p className="mt-5 text-center">로그인 후 이용해 주세요.</p>
            )}
        </Container>
    )
}

export default PlannerApp
