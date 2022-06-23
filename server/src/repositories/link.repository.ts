import {Datasources} from '#types/datasources'
import MariaDBDataSource = Datasources.MariaDBDataSource
import LinkRepository = Repositories.LinkRepository

export const makeLinkRepository = (datasource: MariaDBDataSource): LinkRepository => {
    const addLinkBase = async (url: string) => {
        const res = (await datasource.exec(`INSERT INTO link (url) VALUES (?)`, [url])) as any
        return res.insertId
    }

    const modLink = async (id: number, shortId: string) => {
        const ret = await datasource.exec(`UPDATE link SET shortId = ? WHERE id = ?`, [shortId, id])
        return ret.affectedRows
    }

    const getLink = async (id: number) => {
        const [list]: DTO.LinkDTO[] = (await datasource.exec(`SELECT * FROM link WHERE id = ? LIMIT 1`, [id])) as any
        return list
    }

    return {
        addLinkBase,
        modLink,
        getLink,
    }
}
