import Header from 'components/header'

const Layout = props => {
    return (
        <>
            <Header />
            <main>{props.children}</main>
        </>
    )
}

export default Layout
