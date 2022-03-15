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

                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
                <link rel="apple-touch-icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
                <meta name="theme-color" content="#222222" />

                <link
                    href="/splashscreens/iphone5_splash.png"
                    media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
                    rel="apple-touch-startup-image"
                />
                <link
                    href="/splashscreens/iphone6_splash.png"
                    media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
                    rel="apple-touch-startup-image"
                />
                <link
                    href="/splashscreens/iphoneplus_splash.png"
                    media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
                    rel="apple-touch-startup-image"
                />
                <link
                    href="/splashscreens/iphonex_splash.png"
                    media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
                    rel="apple-touch-startup-image"
                />
                <link
                    href="/splashscreens/iphonexr_splash.png"
                    media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
                    rel="apple-touch-startup-image"
                />
                <link
                    href="/splashscreens/iphonexsmax_splash.png"
                    media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
                    rel="apple-touch-startup-image"
                />
                <link
                    href="/splashscreens/ipad_splash.png"
                    media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
                    rel="apple-touch-startup-image"
                />
                <link
                    href="/splashscreens/ipadpro1_splash.png"
                    media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
                    rel="apple-touch-startup-image"
                />
                <link
                    href="/splashscreens/ipadpro3_splash.png"
                    media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
                    rel="apple-touch-startup-image"
                />
                <link
                    href="/splashscreens/ipadpro2_splash.png"
                    media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
                    rel="apple-touch-startup-image"
                />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default wrapper.withRedux(App)
