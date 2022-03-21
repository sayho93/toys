const ArticleMapper = dataSource => {
    const getArticles = async ({searchTxt = '', page = 1, limit = 12}) => {
        const filter = `AND (content LIKE '%${searchTxt}%' OR user.name LIKE '%${searchTxt}%' OR user.email LIKE '%${searchTxt}%')`
        const query = `
            SELECT article.*, user.name as author, user.email as email, file.originName, file.path, file.shortPath, file.size, file.width, file.height 
            FROM article JOIN user ON article.userId = user.id LEFT JOIN file ON article.fileId = file.id
            WHERE article.status = 1 ${searchTxt && filter}
            ORDER BY article.regDate DESC
            LIMIT ?, ?
        `
        const [list] = await dataSource.exec(query, [(+page - 1) * +limit, +limit])
        return list
    }

    const getArticleInfo = async ({id}) => {
        const query = `
            SELECT article.*, user.name as author, user.email as email, file.originName, file.path, file.shortPath, file.size, file.width, file.height 
            FROM article JOIN user ON article.userId = user.id LEFT JOIN file ON article.fileId = file.id
            WHERE article.id = ?
        `
        const [ret] = dataSource.exec(query, [id])
        return ret
    }

    const getComments = async ({id}) => {
        const query = `SELECT * FROM comment WHERE articleId = ? ORDER BY parentId, depth, regDate`
        const [ret] = dataSource.exec(query, [id])
        return ret
    }

    const upsertArticle = async ({id = 0, userId, fileId = 0, content, status = 1}) => {
        //delete article available
        const query = `
            INSERT INTO article (id, userId, fileId, content)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE fileId = ?, content = ?, status = ?
        `
        const [ret] = await dataSource.exec(query, [id, userId, fileId, content, fileId, content, status])
        return ret.insertId
    }

    const upsertComment = async ({id = 0, userId, articleId, parentId = 0, depth = 0, content, status = 1}) => {
        //delete comment available
        const query = `
            INSERT INTO comment (id, userId, articleId, parentId, depth, content, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE content = ?, status = ?
        `
        const [ret] = await dataSource.exec(query, [id, userId, articleId, parentId, depth, content, status, content, status])
        return ret.insertId
    }

    return {getArticles, getArticleInfo, getComments, upsertArticle, upsertComment}
}

export default ArticleMapper
