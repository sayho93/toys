import styles from 'styles/alert.module.css'
import classNames from 'classnames'

const Alert = ({children, type}) => {
    return (
        <div
            className={classNames({
                [styles.alert]: type === 'success',
                [styles.error]: type === 'error',
            })}
        >
            {children}
        </div>
    )
}
export default Alert
