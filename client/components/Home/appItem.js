import Link from 'next/link'
import styles from './appItem.module.css'

const AppItem = (props = null) => {
    return (
        <>
            <div className="col">
                <div className={`rounded py-2 px-3 ${styles.appBorder}`}>
                    <div className={`${styles.appIcon} bg-primary bg-gradient`}>
                        <i className={`bi ${props.icon} text-white`} />
                    </div>
                    <h2>{props.title}</h2>
                    <p>{props.description}</p>

                    <Link href={{pathname: props.route}}>
                        <a href="#" className={`${styles.appLink} appLink`} data-app={props.title}>
                            go
                            <i className="bi bi-chevron-right linkIcon" />
                        </a>
                    </Link>
                </div>
            </div>
        </>
    )
}
export default AppItem
