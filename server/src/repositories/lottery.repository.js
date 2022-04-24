const LotteryRepository = dataSource => {
    const addLottery = async data => {
        const {userId, roundNo, numberCSV} = data
        const [lottery] = await dataSource.exec(`INSERT INTO lottery(userId, roundNo, numberCSV)VALUES (?, ?, ?)`, [userId, roundNo, numberCSV])
        return lottery.insertId
    }

    const getLotteryList = async (userId, searchTxt, page, limit) => {
        const filter = userId ? `lottery.userId = ${userId}` : '1=1'
        const query = `
                SELECT lottery.*, user.name AS userName, user.email AS email, user.status AS userStatus
                FROM lottery LEFT JOIN user ON lottery.userId = user.id 
                WHERE ${filter} ${searchTxt && `AND (lottery.roundNo LIKE '%${searchTxt}%' OR user.email LIKE '%${searchTxt}%' OR user.name LIKE '%${searchTxt}%')`}
                ORDER BY regDate DESC
                LIMIT ?, ?
            `
        const [list] = await dataSource.exec(query, [(+page - 1) * +limit, +limit])
        return list
    }

    const getLotteryFameList = async (searchTxt, page, limit) => {
        const searchOptions = ` (lottery.roundNo LIKE '%${searchTxt}%' OR user.email LIKE '%${searchTxt}%' OR user.name LIKE '%${searchTxt}%')`

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
        const [list] = await dataSource.exec(query, [(+page - 1) * +limit, +limit])
        return list
    }

    const getBatchTargetList = async week => {
        const [list] = await dataSource.exec(
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
        return list
    }

    const updateLottery = async data => {
        const [lottery] = await dataSource.exec('UPDATE lottery SET correctCSV = ?, bonusNo = ?, `rank` = ?, isProcessed = 1 WHERE id = ?', [
            data.correctCSV,
            data.bonusNo,
            data.rank,
            data.id,
        ])
        return lottery.affectedRows
    }

    return {addLottery, getLotteryList, getBatchTargetList, updateLottery, getLotteryFameList}
}

export default LotteryRepository
