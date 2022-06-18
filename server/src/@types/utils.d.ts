import winston from 'winston'
import multer from 'multer'
import {Request} from 'express'

namespace Utils {
    export type Log = winston.Logger

    export interface MailSender {
        sendMailTo(title: string, message: string, {name, addr}: {name: string; addr: string}, html?: string): Promise<boolean>
        sendMailToMulti(title: string, message: string, list: {name: string; addr: string}[]): Promise<string[]>
    }

    export interface PushManager {
        send(registrationKeys: string[], title: string, message: string, extras: any): Promise<void>
        sendOnlyData(registrationKeys: string[], extras): void
    }

    export type Task = (...args: any[]) => Promise<any>

    export interface TaskQueue {
        runTask(task: () => Promise<any>): Promise<void>
    }

    export interface HttpUtil {
        getData(url: string, params?: any): Promise<any>
        postData(url: string, data?: any): Promise<any>
        putData(url: string, data?: any): Promise<any>
        patchData(url: string, data?: any): Promise<any>
        deleteData(url: string, params?: any): Promise<any>
    }

    export interface File {
        getExtension(fileName: string): string
        removeFile(path: string): Promise<void>
        Multipart: multer.Multer
    }

    export interface ErrorHandler {
        BaseError(message: string, status: number): Error & {status: number}
        validationErrorHandler(req: Request): void
    }

    export interface Encryptor {
        encryptSHA(str: string): string
        hashEncode(num: number): string
        hashDecode(str: string): number
    }

    export interface DateUtil {
        getWeek(): number
    }

    export interface RequestBatcher {
        check(key: string, promise: () => Promise<any>): Promise<any>
    }
}
