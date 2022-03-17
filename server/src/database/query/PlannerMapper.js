const PlannerMapper = dataSource => {
    const getLatestPlanner = async () => {
        const [result] = await dataSource.exec(`SELECT * FROM planner ORDER BY id DESC LIMIT 1`)
        return result[0]
    }

    const getPlannerList = async data => {
        const [list] = await dataSource.exec(`SELECT P.*, U.email, U.name FROM planner P JOIN user U ON P.userId = U.id WHERE P.status = 1 ORDER BY P.id DESC`)
        return list
    }

    const savePlanner = async ({id = 0, userId, title, content, color, targetDate}) => {
        const query = `
            INSERT INTO planner (id, userId, title, content, color, targetDate) VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title = ?, content = ?, color = ?, targetDate = ?
        `
        const [result] = await dataSource.exec(query, [id, userId, title, content, color, targetDate, title, content, color, targetDate])
        return result.insertId
    }

    const deletePlanner = async id => {
        const query = `UPDATE planner SET status = 0 WHERE id = ?`
        const [result] = await dataSource.exec(query, [id])
        return result.affectedRows
    }

    return {getPlannerList, savePlanner, deletePlanner, getLatestPlanner}
}

export default PlannerMapper
