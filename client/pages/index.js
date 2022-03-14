import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {setCurrentApp} from 'store/modules/app'
import AppInfo from 'constants/AppInfo'
import AppItem from 'components/Home/appItem'

const Home = () => {
    const apps = AppInfo
    const dispatch = useDispatch()
    // const user = useSelector(({user}) => user)

    // const ret = useSWR(`http://localhost:4000/api/user/1`, Helper.get)
    // const ret = useSWR(`${Constants.API_ENDPOINT}/`, url => Helper.get(url, {id: 12221}))
    // const ret = useSWR(`${Constants.API_ENDPOINT}/signup`, url => Helper.post(url, {str: '123456'}))

    useEffect(() => {
        dispatch(setCurrentApp('Home'))
    }, [])

    // const setApp = useCallback(
    //     event => {
    //         const app = event.target.closest('.appLink')
    //         dispatch(setCurrentApp(app.dataset.app))
    //     },
    //     [dispatch]
    // )

    return (
        <>
            <div className="container">
                <div className="px-4">
                    {/*<h2 className="pb-2 border-bottom">Toys</h2>*/}
                    <div className="row g-4 py-5 row-cols-1 row-cols-lg-3 row-cols-md-2">
                        {apps.map((item, idx) => (
                            <AppItem key={idx} {...item} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="divider" />
        </>
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

export default Home
