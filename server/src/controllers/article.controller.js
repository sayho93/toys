const ArticleController = ArticleService => {
    const list = async (req, res) => {
        const ret = await ArticleService.getArticleList(req.query)
        res.json(ret)
    }

    const getById = async (req, res) => {
        const id = req.params.id
        const ret = await ArticleService.getArticle({id})
        res.json(ret)
    }

    const save = async (req, res) => {
        const params = req.body
        const ret = await ArticleService.saveArticle(params)
        res.json(ret)
    }

    const saveComment = async (req, res) => {
        const params = req.body
        const ret = await ArticleService.saveComment(params)
        res.json(ret)
    }

    return {
        list,
        getById,
        save,
        saveComment,
    }
}

export default ArticleController
