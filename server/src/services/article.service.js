import Log from '#utils/logger'

const ArticleService = ({ArticleRepository}) => {
    const getArticleList = async params => {
        return await ArticleRepository.getArticles(params)
    }

    const getArticle = async params => {
        const ret = {}
        const article = await ArticleRepository.getArticleInfo(params)
        if (article.length) ret.article = article[0]
        ret.comments = await ArticleRepository.getComments(params)
        return ret
    }

    const saveArticle = async params => {
        return await ArticleRepository.upsertArticle(params)
    }

    const saveComment = async params => {
        Log.error(params.id !== 0)
        if (+params.id !== 0) return await ArticleRepository.upsertComment(params)
        else {
            const insertId = await ArticleRepository.upsertComment(params)
            if (+params.depth === 0) {
                params.id = insertId
                params.parentId = params.id
                return await ArticleRepository.upsertComment(params)
            }
            return insertId
        }
    }

    return {
        getArticleList,
        getArticle,
        saveArticle,
        saveComment,
    }
}

export default ArticleService
