import Container from 'components/container'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import Constants from 'api/Constants'
import Helper from 'api/Helper'
import CalendarHeader from 'components/planner/calendarHeader'
import Calendar from 'components/planner/calendar'
import {getCalendarFirstDay, getCalendarLastDay, sameDay} from 'utils/date'
import TaskModal from 'components/planner/taskModal'
import useUser from 'lib/useUser'
import LoadingFixed from 'components/LoadingFixed'

const PlannerApp = props => {
    const [modalLoading, setModalLoading] = useState({save: false, delete: false})
    const [modal, setModal] = useState(false)
    const [date, setDate] = useState(new Date())
    const [days, setDays] = useState([])
    const [task, setTask] = useState({})
    const {user, mutateUser} = useUser()
    const {data, error, isValidating, mutate} = useSWR(Constants.API_PLANNER_LIST, Helper.get, {fallbackData: props.data})

    useEffect(() => {
        const getUser = async () => {
            if (user) {
                await Helper.get(`${Constants.API_USER_NOTIFIED}/${user.id}`)
                mutateUser()
            }
        }
        getUser()
    }, [])

    useEffect(() => {
        const init = async () => {
            if (data) {
                const tmpDays = []
                const first = getCalendarFirstDay(date)
                const last = getCalendarLastDay(date)

                do {
                    first.setDate(first.getDate() + 1)
                    tmpDays.push({
                        date: new Date(first.getTime()),
                        tasks: data.filter(task => sameDay(first, new Date(task.targetDate))),
                    })
                } while (!sameDay(first, last))
                setDays(tmpDays)
            }
        }
        init()
    }, [data, date])

    const onTaskClick = (event, task) => {
        event.preventDefault()
        event.stopPropagation()
        setTask(task)
        setModal(true)
    }

    const onSave = async () => {
        setModalLoading({...modalLoading, save: true})
        const ret = await Helper.post(Constants.API_PLANNER_SAVE, {...task, userId: user.id})
        if (ret) {
            await mutate()
            setModalLoading({...modalLoading, save: false})
            setModal(false)
            setTask({})
        } else alert('Failed to save task')
    }

    const onDelete = async () => {
        setModalLoading({...modalLoading, delete: true})
        const ret = await Helper.get(`${Constants.API_PLANNER_DELETE}/${task.id}`)
        if (ret) {
            await mutate()
            setModal(false)
            setTask({})
        } else alert('Failed to delete task')
        setModalLoading({...modalLoading, delete: false})
    }

    return (
        <Container app="Planner">
            {isValidating && <LoadingFixed />}
            {modal && <TaskModal date={date} task={task} setTask={setTask} setModal={setModal} loading={modalLoading} onSave={onSave} onDelete={onDelete} user={user} />}
            {user && user.id ? (
                <>
                    {!error && !isValidating && (
                        <>
                            <CalendarHeader date={date} setDate={setDate} />
                            <Calendar days={days} date={date} setDate={setDate} onTaskClick={onTaskClick} />
                        </>
                    )}
                </>
            ) : (
                <p className="mt-5 text-center">로그인 후 이용해 주세요.</p>
            )}
        </Container>
    )
}

export const getServerSideProps = async () => {
    const data = await Helper.get(Constants.API_PLANNER_LIST)
    return {props: {data}}
}

export default PlannerApp
