import Log from 'src/utils/Logger'

const Response = (returnCode, returnMessage, data) => {
    let res = {returnCode: returnCode, returnMessage: returnMessage, data: data}
    Log.info(JSON.stringify(res))
    return res
}

export default Response
