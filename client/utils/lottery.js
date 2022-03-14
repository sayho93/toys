import moment from 'moment'
const lotteryUtils = {
    getWeek: () => {
        const t1 = moment('2002-12-07 21:00:00', 'YYYY-MM-DD hh:mm:ss')
        const t2 = moment()
        // const t2 = moment('2022-03-12 21:01:00', 'YYYY-MM-DD hh:mm:ss')
        const dff = moment.duration(t2.diff(t1)).asDays()
        return Math.ceil(dff / 7) + 1
    },
}
export default lotteryUtils
