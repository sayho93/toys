// Top level component
import Head from 'next/head'

// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-dark-5/dist/css/bootstrap-dark.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'styles/global.css'

import {wrapper} from '../store'
import Layout from '../components/layout'
import {useEffect} from 'react'

const App = ({Component, pageProps}) => {
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle')
    })

    return (
        <>
            <Head>
                <title>Toys</title>
                <link rel="sortcut icon" href="/favicon.ico" />
                <meta
                    property="og:image"
                    content="https://og-image.vercel.app/**Toy%20Projects**.jpeg?theme=dark&md=1&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-white-logo.svg&widths=800&heights="
                />
                <meta property="og:site_name" content="Toys" key="og-site-name" />
                <meta property="og:title" content="Toys" key="og-title" />
                <meta property="og:description" content="Integration of toy projects" key="og-desc" />

                <meta name="twitter:card" content="summary_large_image" />

                <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1.0, user-scalable=no" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default wrapper.withRedux(App)
