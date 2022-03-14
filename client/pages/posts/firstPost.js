import Image from 'next/image'
import Layout from 'components/tutorial/layout'

const FirstPost = () => {
    return (
        <Layout>
            {/*<div className="container">*/}
            <h1>First Post</h1>
            <Image src="/static/images/profile.jpeg" height={144} width={144} alt="profile" />
            {/*</div>*/}
        </Layout>
    )
}
export default FirstPost
