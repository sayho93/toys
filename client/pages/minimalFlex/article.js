import Container from 'components/container'
import {useRouter} from 'next/router'

const Article = () => {
    const router = useRouter()
    const {id} = router.query
    console.log(id)
    return (
        <Container app="Minimal Flex">
            <h1>Article</h1>
        </Container>
    )
}

export default Article
