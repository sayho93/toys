import axios from 'axios'
import ErrorHandlerUtil from '#utils/errorHandler.util'

const HttpUtil = () => {
    const getData = async (url: string, params = {}) => {
        try {
            const response = await axios.get(url, {params: params})
            return response.data
        } catch (error) {
            console.log(error)
            throw ErrorHandlerUtil.BaseError('http get error', 400)
        }
    }

    const postData = async (url: string, data = {}) => {
        try {
            const response = await axios.post(url, data)
            return response.data
        } catch (error) {
            console.log(error)
            throw ErrorHandlerUtil.BaseError('http post error', 400)
        }
    }

    const putData = async (url: string, data = {}) => {
        try {
            const response = await axios.put(url, data)
            return response.data
        } catch (error) {
            console.log(error)
            throw ErrorHandlerUtil.BaseError('http put error', 400)
        }
    }

    const patchData = async (url: string, data = {}) => {
        try {
            const response = await axios.patch(url, data)
            return response.data
        } catch (error) {
            console.log(error)
            throw ErrorHandlerUtil.BaseError('http patch error', 400)
        }
    }

    const deleteData = async (url: string, params = {}) => {
        try {
            const response = await axios.delete(url, params)
            return response.data
        } catch (error) {
            console.log(error)
            throw ErrorHandlerUtil.BaseError('http delete error', 400)
        }
    }

    return {
        getData,
        postData,
        putData,
        patchData,
        deleteData,
    }
}

export default HttpUtil()
