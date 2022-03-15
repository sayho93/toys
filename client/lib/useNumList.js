import Constants from 'api/Constants'
import Helper from 'api/Helper'
import useSWRInfinite from 'swr/infinite'

const useNumList = ({id = null, type = 0, searchTxt = null} = {}) => {
    const queryParams = {}
    if (id) queryParams.userId = id
    if (searchTxt) queryParams.searchTxt = searchTxt
    queryParams.limit = 12

    const url = type === 0 ? Constants.API_NUM_LIST : Constants.API_FAME_LIST

    // const {data, error, isValidating, mutate} = useSWR([url, queryParams], Helper.get)
    // return {
    //     data: {numList: data, isLoading: isValidating || (!error && !data), isError: error},
    //     mutateNumList: mutate,
    // }

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.length) return null // reached the end
        queryParams.page = pageIndex + 1
        return [url, {...queryParams}] // SWR key
    }

    const {data, error, isValidating, mutate, size, setSize} = useSWRInfinite(getKey, Helper.get)

    return {
        numListData: {numList: data, isLoading: isValidating || (!error && !data), isError: error},
        mutateNumList: mutate,
        numListSize: size,
        setNumListSize: setSize,
    }
}
export default useNumList
