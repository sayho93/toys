const LinkRepository = ({DataSourceMariaDB}) => {
    const addLinkBase = async url => {
        const [res] = await DataSourceMariaDB.exec(`INSERT INTO link (url) VALUES (?)`, [url])
        return res.insertId
    }

    const modLink = async (id, shortId) => {
        const [result] = await DataSourceMariaDB.exec(`UPDATE link SET shortId = ? WHERE id = ?`, [shortId, id])
        return result
    }

    const getLink = async id => {
        const [list] = await DataSourceMariaDB.exec(`SELECT * FROM link WHERE id = ? LIMIT 1`, [id])
        return list[0]
    }

    return {
        addLinkBase,
        modLink,
        getLink,
    }
}

export default LinkRepository
