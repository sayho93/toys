import Container from 'components/container'
import Feed from 'components/minimalFlex/feed'
import useArticleList from 'lib/useArticleList'
import LoadingFixed from 'components/LoadingFixed'
import {useSelector} from 'react-redux'
import useUser from 'lib/useUser'

const MinimalFlexApp = () => {
    const {user} = useUser()
    const searchInfo = useSelector(({search}) => search)
    const {articleListData, mutateArticleList, articleListSize, setArticleListSize} = useArticleList({searchTxt: searchInfo.searchTxt})

    return (
        <Container app="Minimal Flex">
            {articleListData.isLoading && <LoadingFixed />}
            <Feed list={articleListData.articleList} mutateList={mutateArticleList} listSize={articleListSize} setListSize={setArticleListSize} userId={user.id} />
        </Container>
    )
}

export default MinimalFlexApp
