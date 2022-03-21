import Container from 'components/container'
import Feed from 'components/minimalFlex/feed'
import useArticleList from 'lib/useArticleList'
import {useEffect, useState} from 'react'
import LoadingFixed from 'components/LoadingFixed'
import WriteModal from 'components/minimalFlex/writeModal'
import useUser from 'lib/useUser'
import Helper from 'api/Helper'
import Constants from 'api/Constants'

const MinimalFlexApp = () => {
    const {user} = useUser()
    const {articleListData, mutateArticleList, articleListSize, setArticleListSize} = useArticleList()
    const [modalOpen, setModalOpen] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [writeInfo, setWriteInfo] = useState({fileId: 0, content: ''})

    useEffect(() => {
        console.log(writeInfo)
    }, [writeInfo])

    const onSave = async () => {
        setModalLoading(true)
        const params = {...writeInfo, userId: user.id}
        console.log(params)
        const res = await Helper.post(Constants.API_ARTICLE_SAVE, params)
        if (res) {
            await mutateArticleList()
            setModalLoading(false)
            setWriteInfo({fileId: 0, content: ''})
            setModalOpen(false)
        }
    }

    return (
        <Container app="Minimal Flex">
            {modalOpen && <WriteModal loading={modalLoading} onSave={onSave} onClose={() => setModalOpen(false)} info={writeInfo} setInfo={setWriteInfo} />}
            {articleListData.isLoading && <LoadingFixed />}
            <Feed list={articleListData.articleList} setOpen={setModalOpen} />
        </Container>
    )
}

export default MinimalFlexApp
