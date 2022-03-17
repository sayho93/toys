const PlannerMapper = dataSource => {
    const getPlannerList = async data => {
        const [list] = await dataSource.exec(`SELECT P.*, U.email, U.name FROM planner P JOIN user U ON P.userId = U.id WHERE P.status = 1 ORDER BY P.id DESC`)
        return list
    }

    const addPlanner = async ({userId, content, color, targetDate}) => {
        const [result] = await dataSource.exec(`INSERT INTO planner (userId, content, color, targetDate) VALUES (?, ?, ?, ?)`, [userId, content, color, targetDate])
        return result.insertId
    }

    return {getPlannerList, addPlanner}
}

export default PlannerMapper
