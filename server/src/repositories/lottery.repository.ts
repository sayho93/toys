import {Datasources} from '#types/datasources'
import MariaDBDataSource = Datasources.MariaDBDataSource
import LotteryRepository = Repositories.LotteryRepository

export const makeLotteryRepository = (datasource: MariaDBDataSource): LotteryRepository => {
    const addLottery = async (data: DTO.LotteryDTO) => {
        const {userId, roundNo, numberCSV} = data
        const lottery = await datasource.exec(`INSERT INTO lottery(userId, roundNo, numberCSV)VALUES (?, ?, ?)`, [userId, roundNo, numberCSV])
        return lottery.insertId
    }

    const getLotteryList = async (data: DTO.LotteryDTO) => {
        const filter = data.userId ? `lottery.userId = ${data.userId}` : '1=1'
        const query = `
                SELECT lottery.*, user.name AS userName, user.email AS email, user.status AS userStatus
                FROM lottery LEFT JOIN user ON lottery.userId = user.id 
                WHERE ${filter} ${
            data.searchTxt && `AND (lottery.roundNo LIKE '%${data.searchTxt}%' OR user.email LIKE '%${data.searchTxt}%' OR user.name LIKE '%${data.searchTxt}%')`
        }
                ORDER BY regDate DESC
                LIMIT ?, ?
            `
        if (!data.page) data.page = 1
        if (!data.limit) data.limit = 10
        return await datasource.exec(query, [(+data.page - 1) * +data.limit, +data.limit])
    }

    const getLotteryFameList = async (data: DTO.LotteryDTO) => {
        const searchOptions = ` (lottery.roundNo LIKE '%${data.searchTxt}%' OR user.email LIKE '%${data.searchTxt}%' OR user.name LIKE '%${data.searchTxt}%')`

        const query = `
            SELECT lottery.*, user.name AS userName, user.email AS email, user.status AS userStatus
            FROM lottery LEFT JOIN user ON lottery.userId = user.id
            WHERE lottery.rank > 0 AND ${searchOptions}
            ORDER BY
                lottery.\`rank\`,
                lottery.roundNo DESC,
                lottery.regDate DESC
            LIMIT ?, ?
        `
        if (!data.page) data.page = 1
        if (!data.limit) data.limit = 10
        return await datasource.exec(query, [(+data.page - 1) * +data.limit, +data.limit])
    }

    const getBatchTargetList = async (week: number) => {
        return await datasource.exec(
            `
                SELECT
                    *,
                    (SELECT name FROM user WHERE id = lottery.userId) AS name,
                    (SELECT email FROM user WHERE id = lottery.userId) AS email
                FROM lottery
                WHERE roundNo <= ? AND isProcessed = 0
                ORDER BY roundNo DESC
            `,
            [week]
        )
    }

    const updateLottery = async (data: DTO.LotteryDTO) => {
        const lottery = await datasource.exec('UPDATE lottery SET correctCSV = ?, bonusNo = ?, `rank` = ?, isProcessed = 1 WHERE id = ?', [
            data.correctCSV,
            data.bonusNo,
            data.rank,
            data.id,
        ])
        return lottery.affectedRows
    }

    return {
        addLottery,
        getLotteryList,
        getLotteryFameList,
        getBatchTargetList,
        updateLottery,
    }
}
