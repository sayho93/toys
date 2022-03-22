class ArticleSVC {
    constructor({Config, Mappers, Utils, Log, MailSender, PushManager}) {
        this.Config = Config
        this.Mappers = Mappers
        this.Utils = Utils
        this.Log = Log
        this.MailSender = MailSender
        this.PushManager = PushManager
    }

    async getArticleList(params) {
        return await this.Mappers.articleMapper.getArticles(params)
    }

    async getArticle(params) {
        const ret = {}
        const article = await this.Mappers.articleMapper.getArticleInfo(params)
        if (article.length) ret.article = article[0]
        ret.comments = await this.Mappers.articleMapper.getComments(params)
        return ret
    }

    async saveArticle(params) {
        return await this.Mappers.articleMapper.upsertArticle(params)
    }

    async saveComment(params) {
        this.Log.error(params.id !== 0)
        if (+params.id !== 0) return await this.Mappers.articleMapper.upsertComment(params)
        else {
            const insertId = await this.Mappers.articleMapper.upsertComment(params)
            if (+params.depth === 0) {
                params.id = insertId
                params.parentId = params.id
                return await this.Mappers.articleMapper.upsertComment(params)
            }
            return insertId
        }
    }
}

export default ArticleSVC
