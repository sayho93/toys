const LinkController = ({LinkService, ErrorHandlerUtil}) => {
    const generateShortLink = async (req, res) => {
        ErrorHandlerUtil.validationErrorHandler(req)
        res.json(await LinkService.generateShortLink(req.body.url))
    }

    const getShortLink = async (req, res) => {
        const ret = await LinkService.getShortLink(req.params.shortId)
        if (!ret) {
            const err = new Error()
            err.status = 404
            err.message = 'Short link not found'
            throw err
        }
        delete ret.id
        res.json({data: ret})
    }

    const redirectShortLink = async (req, res) => {
        const ret = await LinkService.getShortLink(req.params.shortId)
        if (!ret) {
            const err = new Error()
            err.status = 404
            err.message = 'Short link not found'
            throw err
        }
        res.redirect(ret.url)
    }

    return {
        generateShortLink,
        getShortLink,
        redirectShortLink,
    }
}

export default LinkController
