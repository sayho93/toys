import {useRouter} from 'next/router'
import useSWR from 'swr'
import Constants from 'api/Constants'
import Helper from 'api/Helper'
import Container from 'components/container'
import {useEffect, useState} from 'react'
import ArticleView from 'components/minimalFlex/articleView'
import useUser from 'lib/useUser'
import Comment from 'components/minimalFlex/comment'
import CommentModal from 'components/minimalFlex/commentModal'

const Article = ({articleData}) => {
    const {user} = useUser()
    const router = useRouter()
    const {id} = router.query
    const {data: article, mutate, isValidating, error} = useSWR(`${Constants.API_ARTICLE}/${id}`, Helper.get, {fallbackData: articleData})

    const [commentModal, setCommentModal] = useState(false)
    const [commentInfo, setCommentInfo] = useState({id: 0, content: ''})
    const [commentLoading, setCommentLoading] = useState(false)

    useEffect(() => {
        console.log(commentInfo)
    }, [commentInfo])

    const onLike = () => {
        console.log('onLike')
    }

    const onComment = (id = 0) => {
        console.log('onComment', id)
        const params = {...commentInfo, parentId: id, depth: id ? 1 : 0}
        setCommentInfo(params)
        setCommentModal(true)
    }

    const onCommentSave = async () => {
        setCommentLoading(true)
        console.log('onCommentSave')
        console.log({...commentInfo, userId: user.id, articleId: article.article.id})
        const res = await Helper.post(Constants.API_ARTICLE_COMMENT_SAVE, {...commentInfo, userId: user.id, articleId: article.article.id})
        if (res) {
            setCommentInfo({id: 0, content: ''})
            setCommentModal(false)
        }
        await mutate()
        setCommentLoading(false)
    }

    return (
        <Container app="Minimal Flex">
            {commentModal && (
                <CommentModal onClose={() => setCommentModal(false)} onSave={onCommentSave} loading={commentLoading} comment={commentInfo} setComment={setCommentInfo} />
            )}
            <ArticleView data={article.article} onLike={onLike} onComment={onComment} />
            <div className="list-group">
                {article.comments.map(comment => (
                    <Comment key={comment.id} data={comment} onComment={onComment} />
                ))}
            </div>
        </Container>
    )
}

export const getServerSideProps = async context => {
    const {id} = context.query
    const articleData = await Helper.get(`${Constants.API_ARTICLE}/${id}`)
    return {props: {articleData}}
}

export default Article
