import Header from 'components/header'
// import profile from '../../public/profile'
const Layout = props => {
    return (
        <>
            <Header />
            <main>{props.children}</main>
        </>
    )
}

export default Layout
