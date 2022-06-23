import {Request, Response} from 'express'
import {Controllers} from '#types/controllers'
import {Utils} from '#types/utils'

import fs from 'fs'
import path from 'path'
import FileController = Controllers.FileController
import Log = Utils.Log
import ErrorHandler = Utils.ErrorHandler
import FileService = Services.FileService

export const makeFileController = (service: FileService, ErrorHandler: ErrorHandler, Log: Log): FileController => {
    const uploadSingleFile = async (req: Request, res: Response) => {
        let userId = req.body.userId
        let desc = req.body.desc
        let file = req.file
        if (!file) throw ErrorHandler.BaseError('File not found', 400)
        const ret = await service.processFile(userId, file, desc)
        res.header('Access-Control-Allow-Origin', '*')
        res.json(ret)
    }

    const removeSingleFile = async (req: Request, res: Response) => {
        // const id = +req.params.id
        const id = +req.body
        const ret = await service.removeFile(id)
        res.header('Access-Control-Allow-Origin', '*')
        res.json(ret)
    }

    const downloadSingleFile = async (req: Request, res: Response) => {
        const id = +req.params.id
        const file = await service.getFile(id)
        if (!file) return res.status(404).send('File not found')

        const data = fs
            .createReadStream(path.resolve(file.path))
            .on('open', () => {
                console.log('open')
            })
            .on('close', () => {
                Log.info('done!')
            })
            .on('error', err => {
                Log.error(err.stack)
                res.status(500).send('Internal server error')
            })
        const disposition = 'attachment; filename="' + file.name + '"'

        res.setHeader('Content-Type', 'image' + '/' + file.ext)
        res.setHeader('Content-Disposition', disposition)

        data.pipe(res)
    }

    return {
        uploadSingleFile,
        removeSingleFile,
        downloadSingleFile,
    }
}
