import {useDispatch} from 'react-redux'
import {useEffect} from 'react'
import {setCurrentApp} from 'store/modules/app'

const Container = ({children}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setCurrentApp('LotGen'))
    }, [])

    return <div className="container">{children}</div>
}
export default Container
