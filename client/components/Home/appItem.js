import Link from 'next/link'
import styles from './appItem.module.css'

const AppItem = (props = null) => {
    return (
        <>
            <Link href={{pathname: props.route}}>
                <div className="col">
                    <div className={`rounded py-2 px-3 ${styles.appBorder}`}>
                        <div className={`${styles.appIcon} bg-primary bg-gradient`}>
                            <i className={`bi ${props.icon} text-white`} />
                        </div>
                        <h2>{props.title}</h2>
                        <p>{props.description}</p>

                        <span>
                            go
                            <i className="bi bi-chevron-right linkIcon" />
                        </span>
                    </div>
                </div>
            </Link>
        </>
    )
}
export default AppItem
