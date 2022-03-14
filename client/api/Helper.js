import axios from 'axios'

const catcher = error => {
    if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
        alert(error.response.data.error)
    } else if (error.request) {
        console.log(error.request)
        // alert(error.request)
    } else {
        console.log('Error', error.message)
        alert(error.message)
    }
    return null
}

const Helper = {
    get: async (url, data = {}) => {
        try {
            const res = await axios.get(url, {params: data})
            return res.data
        } catch (err) {
            return catcher(err)
        }
    },
    post: async (url, data = {}) => {
        const params = new URLSearchParams(data)
        try {
            const res = await axios.post(url, params)
            return res.data
        } catch (err) {
            return catcher(err)
        }
    },
}

export default Helper
