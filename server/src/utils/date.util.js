import moment from 'moment'

const DateUtil = () => {
    const getWeek = () => {
        const t1 = moment('2002-12-07 21:00:00', 'YYYY-MM-DD hh:mm:ss')
        const t2 = moment()
        const dff = moment.duration(t2.diff(t1)).asDays()
        return Math.ceil(dff / 7) + 1
    }

    return {
        getWeek,
    }
}

export default DateUtil()
