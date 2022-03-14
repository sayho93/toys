import {useEffect} from 'react'

const AuthModal = props => {
    useEffect(() => {
        const enterHandler = event => {
            if (event.key === 'Enter') {
                console.log(props.loginInfo)
                event.preventDefault()
                console.log(props.loginInfo)
                props.modalType === 1 ? props.onLogin() : props.onSignup()
            }
        }

        document.addEventListener('keydown', enterHandler)
        return () => document.removeEventListener('keydown', enterHandler)
    }, [props.modalType, props.loginInfo, props.signupInfo])

    return (
        <div className={`modal modal-signin position-fixed d-block bg-secondary bg-opacity-50`} tabIndex="-1" id="modalSignIn">
            <div className="modal-dialog">
                {props.modalType === 1 ? (
                    <div className="modal-content rounded-5 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <h3 className="fw-bold mb-0">Login</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={props.onClose} />
                        </div>

                        <div className="modal-body p-5 pt-0">
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className="form-control form-control-sm rounded-4"
                                    id="email"
                                    placeholder="name@example.com"
                                    value={props.loginInfo.email}
                                    onChange={props.onLoginInputChange}
                                />
                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control form-control-sm rounded-4"
                                    id="password"
                                    placeholder="Password"
                                    value={props.loginInfo.password}
                                    onChange={props.onLoginInputChange}
                                />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <button className="w-100 mb-2 btn btn-lg rounded-4 btn-primary btn-sm" onClick={props.onLogin}>
                                {props.loading && <span className="spinner-border spinner-border-sm me-2" />}
                                Login
                            </button>
                            <small className="text-muted">By clicking Sign up, you agree to the terms of use.</small>
                            <hr className="my-4" />
                            <h2 className="fs-5 fw-bold mb-3">If you don't have account</h2>
                            <button className="w-100 mb-2 btn btn-outline-secondary rounded-4 btn-sm" onClick={() => props.setModalType(0)}>
                                Sign up
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="modal-content rounded-5 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <h3 className="fw-bold mb-0">Sign up for free</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={props.onClose} />
                        </div>

                        <div className="modal-body p-5 pt-0">
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className="form-control rounded-4"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={props.signupInfo.email}
                                    onChange={props.onSignupInputChange}
                                />
                                <label htmlFor="floatingInput">Email address</label>
                                <small className="text-danger">* After signing up, please click the activation link we sent to your email</small>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control rounded-4"
                                    name="password"
                                    placeholder="Password"
                                    value={props.signupInfo.password}
                                    onChange={props.onSignupInputChange}
                                />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control rounded-4"
                                    name="passwordC"
                                    placeholder="Password confirmation"
                                    value={props.signupInfo.passwordC}
                                    onChange={props.onSignupInputChange}
                                />
                                <label htmlFor="floatingPassword">Password Confirmation</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control rounded-4"
                                    name="name"
                                    placeholder="Name"
                                    value={props.signupInfo.name}
                                    onChange={props.onSignupInputChange}
                                />
                                <label htmlFor="floatingPassword">Name</label>
                            </div>
                            <button className="w-100 mb-2 btn btn-lg rounded-4 btn-primary btn-sm" onClick={props.onSignup}>
                                {props.loading && <span className="spinner-border spinner-border-sm me-2" />}
                                Sign up
                            </button>
                            <small className="text-muted">By clicking Sign up, you agree to the terms of use.</small>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AuthModal
