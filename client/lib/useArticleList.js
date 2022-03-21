import useSWRInfinite from 'swr/infinite'
import Constants from 'api/Constants'
import Helper from 'api/Helper'

const useArticleList = ({id = null, searchTxt = null} = {}) => {
    const queryParams = {}
    if (id) queryParams.userId = id
    if (searchTxt) queryParams.searchTxt = searchTxt
    queryParams.limit = 15

    const {data, error, isValidating, mutate, size, setSize} = useSWRInfinite((pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.length) return null // reached the end
        queryParams.page = pageIndex + 1
        return [Constants.API_ARTICLE_LIST, {...queryParams}] // SWR key
    }, Helper.get)

    return {
        articleListData: {articleList: data, isLoading: isValidating || (!error && !data), isError: error},
        mutateArticleList: mutate,
        articleListSize: size,
        setArticleListSize: setSize,
    }
}

export default useArticleList
