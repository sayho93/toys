const UserRepository = ({DataSourceMariaDB}) => {
    const getUserById = async id => {
        const [user] = await DataSourceMariaDB.exec(`SELECT *FROM user WHERE id = ?`, [id])
        return user
    }

    const getUserByEmail = async email => {
        const [user] = await DataSourceMariaDB.exec(`SELECT *FROM user WHERE email = ?`, [email])
        return user
    }

    const checkLogin = async data => {
        const {email, password} = data
        const [user] = await DataSourceMariaDB.exec(
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

    const addUser = async data => {
        const {email, password, name} = data
        const [res] = await DataSourceMariaDB.exec(`INSERT INTO user (email, password, name)VALUES (?, ?, ?)`, [email, password, name])
        return res.insertId
    }

    const updateUserStatus = async (id, status) => {
        const [user] = await DataSourceMariaDB.exec(`UPDATE user SET status = ?WHERE id = ?`, [status, id])
        return [user]
    }

    const addAuth = async data => {
        const {userId, token} = data
        const [auth] = await DataSourceMariaDB.exec(`INSERT INTO auth(userId, token)VALUES (?, ?)`, [userId, token])
        return auth.insertId
    }

    const deleteAuth = async userId => {
        const [auth] = await DataSourceMariaDB.exec(`DELETE FROM auth WHERE userId = ?`, [userId])
        return [auth]
    }

    const searchAuth = async (userId, token) => {
        const [auth] = await DataSourceMariaDB.exec(`SELECT *FROM auth WHERE userId = ?AND token = ?ORDER BY regDate DESC LIMIT 1`, [userId, token])
        return auth
    }

    const removeAuth = async userId => {
        const [auth] = await DataSourceMariaDB.exec(`DELETE FROM auth WHERE userId = ?`, [userId])
        return [auth]
    }

    const updateToken = async (userId, token) => {
        const [res] = await DataSourceMariaDB.exec(`UPDATE user SET pushToken = ?WHERE id = ?`, [token, userId])
        return res
    }

    const getUserHavingToken = async () => {
        const [res] = await DataSourceMariaDB.exec(`SELECT *FROM user WHERE pushToken IS NOT NULL OR pushToken != ''`)
        return res
    }

    const setUserNotified = async ({userId, id}) => {
        const [res] = await DataSourceMariaDB.exec(`UPDATE user SET lastPlannerId = ?WHERE id = ?`, [id, userId])
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

export default UserRepository
