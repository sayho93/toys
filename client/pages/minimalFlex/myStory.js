import {useSelector} from 'react-redux'
import useUser from 'lib/useUser'
import useArticleList from 'lib/useArticleList'
import Container from 'components/container'
import LoadingFixed from 'components/LoadingFixed'
import Feed from 'components/minimalFlex/feed'

const MyStory = () => {
    const {user} = useUser()
    const searchInfo = useSelector(({search}) => search)
    const {articleListData, mutateArticleList, articleListSize, setArticleListSize} = useArticleList({id: user ? user.id : null, searchTxt: searchInfo.searchTxt})

    return (
        <Container app="Minimal Flex">
            {articleListData.isLoading && <LoadingFixed />}
            <Feed list={articleListData.articleList} mutateList={mutateArticleList} listSize={articleListSize} setListSize={setArticleListSize} user={user} />
        </Container>
    )
}

export default MyStory
