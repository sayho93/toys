import Head from 'next/head'
import Link from 'next/link'
import Layout, {siteTitle} from 'components/tutorial/layout'
import utilStyles from 'styles/utils.module.css'
import Constants from 'api/Constants'
import useSWR from 'swr'
import Helper from 'api/Helper'
import {useRouter} from 'next/router'

export default function Tutorial(props = null) {
    const {data, error} = useSWR(Constants.API_NUM_LIST, Helper)
    console.log(data)
    const router = useRouter()
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>asdasdasd</p>
                <p>
                    (This is a sample website - you’ll be building a site like this on <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
                </p>
                <p>
                    <Link href={{pathname: '/posts/firstPost'}}> to first post</Link>
                </p>
            </section>

            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Blog</h2>
                <ul className={utilStyles.list}>
                    {data &&
                        data.map((item, idx) => (
                            <li className={utilStyles.listItem} key={idx}>
                                {item.name}
                                <br />
                                {/*{id}*/}
                                <br />
                                {/*{date}*/}
                            </li>
                        ))}
                </ul>
            </section>
        </Layout>
    )
}

// export async function getStaticPaths() {
//     return {paths: [{params: {id: 1}}], fallback: false}
// }

// export async function getServerSideProps() {
//     const response = await Api.fetchRandom()
//     let allPostData = []
//     if (response.returnCode === 1) allPostData = response.data
//     else console.error(response.returnMessage)
//     return {props: {allPostData}}
// }

// export async function getStaticProps() {
//     const response = await Api.fetchRandom()
//     console.log(response.returnMessage)
//     if (response.returnCode === 1) {
//         return {
//             props: {
//                 allPostData: response.data,
//             },
//         }
//     } else {
//         console.error(response.returnMessage)
//         return {props: {}}
//     }
// }
