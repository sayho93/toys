import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import {setCurrentApp} from 'store/modules/app'

const Container = ({app, children}) => {
    const dispatch = useDispatch()
    const appInfo = useSelector(({app}) => app)

    useEffect(() => {
        if (appInfo.currentApp !== app) dispatch(setCurrentApp(app))
    }, [])

    return <div className="container">{children}</div>
}
export default Container
