const DateUtils = {
    getDateString: dateStr => {
        const date = new Date(dateStr)
        date.setHours(date.getHours() + 9)
        return date.toISOString().replace('T', ' ').replace('Z', '').substring(0, 19)
    },
    sameDay: (a, b) => {
        return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
    },
    getCalendarFirstDay: date => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        firstDay.setDate(firstDay.getDate() - (firstDay.getDay() === 0 ? 7 : firstDay.getDay()))
        return firstDay
    },
    getCalendarLastDay: date => {
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        lastDay.setDate(lastDay.getDate() + (7 - lastDay.getDay()))
        return lastDay
    },
}
export default DateUtils
