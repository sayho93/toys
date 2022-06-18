import {Datasources} from '#types/datasources'
import MariaDBDataSource = Datasources.MariaDBDataSource
import PlannerRepository = Repositories.PlannerRepository

export const makePlannerRepository = (datasource: MariaDBDataSource): PlannerRepository => {
    const getLatestPlanner = async () => {
        const [ret] = await datasource.exec(`SELECT * FROM planner ORDER BY id DESC LIMIT 1`, [])
        return ret
    }

    const getPlannerList = async () => {
        return await datasource.exec(`SELECT P.*, U.email, U.name FROM planner P JOIN user U ON P.userId = U.id WHERE P.status = 1 ORDER BY P.id DESC`, [])
    }

    const savePlanner = async (data: DTO.PlannerDTO) => {
        const query = `
            INSERT INTO planner (id, userId, title, content, color, targetDate) VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title = ?, content = ?, color = ?, targetDate = ?
        `
        const result = await datasource.exec(query, [
            data.id,
            data.userId,
            data.title,
            data.content,
            data.color,
            data.targetDate,
            data.title,
            data.content,
            data.color,
            data.targetDate,
        ])
        return result.insertId
    }

    const deletePlanner = async (id: number) => {
        const query = `UPDATE planner SET status = 0 WHERE id = ?`
        const result = await datasource.exec(query, [id])
        return result.affectedRows
    }

    return {
        getLatestPlanner,
        getPlannerList,
        savePlanner,
        deletePlanner,
    }
}
