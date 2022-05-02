import axios from 'axios'

const HttpUtil = () => {
    const getData = async (url, params = {}) => {
        try {
            const response = await axios.get(url, {params: params})
            return response.data
        } catch (error) {
            console.log(error)
            const err = new Error('http get error')
            err.status = 400
            throw err
        }
    }

    const postData = async (url, data = {}) => {
        try {
            const response = await axios.post(url, data)
            return response.data
        } catch (error) {
            console.log(error)
            const err = new Error('http post error')
            err.status = 400
            throw err
        }
    }

    const putData = async (url, data = {}) => {
        try {
            const response = await axios.put(url, data)
            return response.data
        } catch (error) {
            console.log(error)
            const err = new Error('http put error')
            err.status = 400
            throw err
        }
    }

    const patchData = async (url, data = {}) => {
        try {
            const response = await axios.patch(url, data)
            return response.data
        } catch (error) {
            console.log(error)
            const err = new Error('http patch error')
            err.status = 400
            throw err
        }
    }

    const deleteData = async (url, data = {}) => {
        try {
            const response = await axios.delete(url, data)
            return response.data
        } catch (error) {
            console.log(error)
            const err = new Error('http delete error')
            err.status = 400
            throw err
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
