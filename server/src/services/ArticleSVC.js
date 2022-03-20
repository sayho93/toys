class ArticleSVC {
    constructor({Config, Mappers, Utils, Log, MailSender, PushManager, FileUtil}) {
        this.Config = Config
        this.Mappers = Mappers
        this.Utils = Utils
        this.Log = Log
        this.MailSender = MailSender
        this.PushManager = PushManager
        this.FileUtil = FileUtil
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
        return await this.Mappers.articleMapper.upsertComment(params)
    }
}

export default ArticleSVC
