import Log from '#utils/logger'

const ArticleService = ({Repositories}) => {
    const getArticleList = async params => {
        return await Repositories.articleRepository.getArticles(params)
    }

    const getArticle = async params => {
        const ret = {}
        const article = await Repositories.articleRepository.getArticleInfo(params)
        if (article.length) ret.article = article[0]
        ret.comments = await Repositories.articleRepository.getComments(params)
        return ret
    }

    const saveArticle = async params => {
        return await Repositories.articleRepository.upsertArticle(params)
    }

    const saveComment = async params => {
        Log.error(params.id !== 0)
        if (+params.id !== 0) return await Repositories.articleRepository.upsertComment(params)
        else {
            const insertId = await Repositories.articleRepository.upsertComment(params)
            if (+params.depth === 0) {
                params.id = insertId
                params.parentId = params.id
                return await Repositories.articleRepository.upsertComment(params)
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
