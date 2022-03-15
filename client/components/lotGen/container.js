import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import {setCurrentApp} from 'store/modules/app'

const Container = ({children}) => {
    const dispatch = useDispatch()
    const appInfo = useSelector(({app}) => app)

    useEffect(() => {
        if (appInfo.currentApp !== 'LotGen') dispatch(setCurrentApp('LotGen'))
    }, [])

    return <div className="container">{children}</div>
}
export default Container
