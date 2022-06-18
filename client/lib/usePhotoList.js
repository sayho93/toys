import Constants from 'api/Constants'
import Helper from 'api/Helper'
import useSWRInfinite from 'swr/infinite'

const usePhotoList = ({id, searchTxt = null} = {}) => {
    const queryParams = {}
    queryParams.userId = id
    if (searchTxt) queryParams.searchTxt = searchTxt
    queryParams.limit = 10

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.length) return null // reached the end
        queryParams.page = pageIndex + 1
        return [Constants.API_PHOTO, {...queryParams}] // SWR key
    }

    const {data, error, isValidating, mutate, size, setSize} = useSWRInfinite(getKey, Helper.get)

    return {
        photoListData: {data, isLoading: isValidating || (!error && !data), isError: error},
        mutatePhotoList: mutate,
        photoListSize: size,
        setPhotoListSize: setSize,
    }
}
export default usePhotoList
