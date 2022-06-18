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
        send<T>(registrationKeys: string[], title: string, message: string, extras?: T): Promise<void>
        sendOnlyData<T>(registrationKeys: string[], extras?: T): void
    }

    export type Task = (...args: any[]) => Promise<any>

    export interface TaskQueue {
        runTask(task: () => Promise<any>): Promise<void>
    }

    export interface HttpUtil {
        getData<T extends {}>(url: string, params?: T): Promise<any>
        postData<T extends {}>(url: string, data?: T): Promise<any>
        putData<T extends {}>(url: string, data?: T): Promise<any>
        patchData<T extends {}>(url: string, data?: T): Promise<any>
        deleteData<T extends {}>(url: string, params?: T): Promise<any>
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
        check<T>(key: string, promise: () => Promise<T>): Promise<T>
    }
}
