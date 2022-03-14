const dateUtils = {
    getDateString: dateStr => {
        const date = new Date(dateStr)
        date.setHours(date.getHours() + 9)
        return date.toISOString().replace('T', ' ').replace('Z', '').substring(0, 19)
    },
}
export default dateUtils
