import {Datasources} from '#types/datasources'
import UserRepository = Repositories.UserRepository
import MariaDBDataSource = Datasources.MariaDBDataSource

export const makeUserRepository = (datasource: MariaDBDataSource): UserRepository => {
    const getUserById = async (id: number) => {
        const [ret] = await datasource.exec(`SELECT * FROM user WHERE id = ?`, [id])
        return ret
    }

    const getUserByEmail = async (email: string) => {
        const [ret] = await datasource.exec(`SELECT * FROM user WHERE email = ?`, [email])
        return ret
    }

    const checkLogin = async (data: DTO.UserDTO) => {
        const {email, password} = data
        const [user] = await datasource.exec(
            `
                SELECT *
                FROM user
                WHERE email = ? AND password = ? AND status = 1
                LIMIT 1
            `,
            [email, password]
        )
        return user
    }

    const updateUserStatus = async (id: number, status: number) => {
        const res = await datasource.exec(`UPDATE user SET status = ? WHERE id = ?`, [status, id])
        return res.affectedRows
    }

    const addUser = async (data: DTO.UserDTO) => {
        const {email, password, name} = data
        const res = await datasource.exec(`INSERT INTO user (email, password, name)VALUES (?, ?, ?)`, [email, password, name])
        return res.insertId
    }

    const addAuth = async (userId: number, token: string) => {
        const auth = await datasource.exec(`INSERT INTO auth(userId, token)VALUES (?, ?)`, [userId, token])
        return auth.insertId
    }

    const deleteAuth = async (userId: number) => {
        return await datasource.exec(`DELETE FROM auth WHERE userId = ?`, [userId])
    }

    const searchAuth = async (userId: number, token: string) => {
        return await datasource.exec(`SELECT *FROM auth WHERE userId = ?AND token = ?ORDER BY regDate DESC LIMIT 1`, [userId, token])
    }

    const removeAuth = async (userId: number) => {
        return await datasource.exec(`DELETE FROM auth WHERE userId = ?`, [userId])
    }

    const updateToken = async (userId: number, token: string) => {
        const res = await datasource.exec(`UPDATE user SET pushToken = ?WHERE id = ?`, [token, userId])
        return res.affectedRows
    }

    const getUserHavingToken = async () => {
        return await datasource.exec(`SELECT *FROM user WHERE pushToken IS NOT NULL OR pushToken != ''`, [])
    }

    const setUserNotified = async (userId: number, id: number) => {
        const res = await datasource.exec(`UPDATE user SET lastPlannerId = ? WHERE id = ?`, [id, userId])
        return res.affectedRows
    }

    return {
        getUserById,
        getUserByEmail,
        checkLogin,
        updateUserStatus,
        addUser,
        addAuth,
        deleteAuth,
        searchAuth,
        removeAuth,
        updateToken,
        getUserHavingToken,
        setUserNotified,
    }
}
