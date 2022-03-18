import Link from 'next/link'
import AuthModal from 'components/lotGen/authModal'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import HeaderInfo from 'constants/HeaderInfo'
import Constants from 'api/Constants'
import Helper from 'api/Helper'
import useUser from 'lib/useUser'
import useNumList from 'lib/useNumList'
import {setSearchInfo} from 'store/modules/search'
import {debounce} from 'utils/utils'
import enableMessaging from 'utils/firebase/enableMessaging'

const Header = () => {
    const dispatch = useDispatch()

    const {user, mutateUser} = useUser({})
    const {mutateNumList} = useNumList()
    const appInfo = useSelector(({app}) => app)
    const headerInfo = HeaderInfo[appInfo.currentApp]

    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState(0)

    const [signupInfo, setSignupInfo] = useState({email: '', password: '', passwordC: '', name: ''})
    const [loginInfo, setLoginInfo] = useState({email: '', password: ''})

    const [authLoading, setAuthLoading] = useState(false)

    useEffect(async () => {
        const token = await enableMessaging()
        if (token && user && user.isLoggedIn) await Helper.post(Constants.API_USER_UPDATE_TOKEN, {userId: user.id, token})
    }, [user])

    const onSearch = async event => {
        debounce(() => {
            dispatch(setSearchInfo({currentApp: appInfo.currentApp, searchTxt: event.target.value}))
            mutateNumList()
        }, 500)()
    }

    const modalHandler = event => {
        const type = event.target.dataset.modaltype
        if (type !== undefined) setModalType(+type)
        setShowModal(!showModal)
    }

    const onSignupInputChange = event => {
        const {name, value} = event.target
        setSignupInfo({...signupInfo, [name]: value})
    }

    const onLoginInputChange = event => {
        const {id, value} = event.target
        setLoginInfo({...loginInfo, [id]: value})
    }

    const signup = async () => {
        if (signupInfo.password !== signupInfo.passwordC) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }
        setAuthLoading(true)
        const ret = await Helper.post(Constants.API_SIGNUP, signupInfo)
        if (ret) {
            alert('이메일 인증 후 로그인이 가능합니다.')
            setShowModal(false)
        }
        setAuthLoading(false)
    }

    const loginHandler = async () => {
        setAuthLoading(true)
        const res = await Helper.post('/api/login', {
            email: loginInfo.email,
            password: loginInfo.password,
        })
        if (res) {
            await mutateUser(user)
            setShowModal(false)
        }
        setAuthLoading(false)
    }

    const logoutHandler = async () => {
        try {
            mutateUser(await Helper.post('/api/logout', {}))
        } catch (err) {
            console.log(err.data.message)
        }
    }

    return (
        <>
            {showModal && (
                <AuthModal
                    loading={authLoading}
                    onClose={modalHandler}
                    showModal={showModal}
                    modalType={modalType}
                    setModalType={setModalType}
                    signupInfo={signupInfo}
                    loginInfo={loginInfo}
                    onSignupInputChange={onSignupInputChange}
                    onLoginInputChange={onLoginInputChange}
                    onSignup={signup}
                    onLogin={loginHandler}
                />
            )}
            <header className="p-3 border-bottom mb-4">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <Link href={{pathname: '/'}}>
                            <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 themedText text-decoration-none">
                                <i className={`bi ${headerInfo.icon} webFontTitle me-2`} />
                                <span className="fs-4">{headerInfo.title}</span>
                            </a>
                        </Link>

                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 ms-lg-auto">
                            {headerInfo.menus.map((menu, idx) => (
                                <Link key={idx} href={{pathname: menu.link}}>
                                    <a href="#" className={`nav-link px-2 themedText`}>
                                        {menu.name}
                                    </a>
                                </Link>
                            ))}
                        </ul>

                        {headerInfo.searchBar && (
                            <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-2">
                                <input
                                    type="search"
                                    className="form-control form-control-dark"
                                    placeholder="Search..."
                                    // value=""
                                    // value={searchInfo.searchTxt}
                                    // onKeyUp={onSearch}
                                    onChange={onSearch}
                                />
                            </div>
                        )}

                        {user && user.isLoggedIn ? (
                            <div className="text-end">
                                <div className="dropdown">
                                    <button className="btn btn-link text-decoration-none dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                        <i className="bi bi-person-fill" />
                                        <span className="ml-2">{user.name}</span>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <a className="dropdown-item" href="#" onClick={logoutHandler}>
                                                logout
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="text-end">
                                <button type="button" className="btn btn-outline-success me-2" data-modaltype={1} onClick={modalHandler}>
                                    Login
                                </button>
                                <button type="button" className="btn btn-warning" data-modaltype={0} onClick={modalHandler}>
                                    Sign-up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
