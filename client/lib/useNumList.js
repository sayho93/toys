import useSWR from 'swr'
import Constants from 'api/Constants'
import Helper from 'api/Helper'

const useNumList = ({id = null, type = 0, searchTxt = null} = {}) => {
    const queryParams = {}
    if (id) queryParams.userId = id
    if (searchTxt) queryParams.searchTxt = searchTxt

    const url = type === 0 ? Constants.API_NUM_LIST : Constants.API_FAME_LIST
    const {data, error, isValidating, mutate} = useSWR([url, queryParams], Helper.get)
    return {
        data: {numList: data, isLoading: isValidating || (!error && !data), isError: error},
        mutateNumList: mutate,
    }
}
export default useNumList
