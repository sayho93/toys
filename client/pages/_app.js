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
        import('react-toastify/dist/ReactToastify.css')
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

                {/*viewport-fit=cover*/}
                <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1.0, user-scalable=no" />

                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#222222" />

                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2048-2732.jpeg"
                    media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1668-2388.jpeg"
                    media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1536-2048.jpeg"
                    media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1668-2224.jpeg"
                    media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1620-2160.jpeg"
                    media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1284-2778.jpeg"
                    media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1170-2532.jpeg"
                    media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1125-2436.jpeg"
                    media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1242-2688.jpeg"
                    media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-828-1792.jpeg"
                    media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1242-2208.jpeg"
                    media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-750-1334.jpeg"
                    media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-640-1136.jpeg"
                    media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                />

                {/*landscape-------------------------*/}
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2732-2048.jpeg"
                    media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2388-1668.jpeg"
                    media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2048-1536.jpeg"
                    media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2224-1668.jpeg"
                    media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2160-1620.jpeg"
                    media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2778-1284.jpeg"
                    media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2532-1170.jpeg"
                    media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2436-1125.jpeg"
                    media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2688-1242.jpeg"
                    media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1792-828.jpeg"
                    media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-2208-1242.jpeg"
                    media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1334-750.jpeg"
                    media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                />
                <link
                    rel="apple-touch-startup-image"
                    href="/splashscreens/apple-splash-1136-640.jpeg"
                    media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                />

                <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                {/*<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />*/}
                <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default wrapper.withRedux(App)
