import Link from 'next/link'
import styles from './appItem.module.css'

const AppItem = (props = null) => {
    const renderNews = () => {
        if (props.title === 'Planner') {
            if (props.user && props.latestPlanner && props.user.lastPlannerId !== undefined) {
                if (props.user.lastPlannerId < props.latestPlanner.id)
                    return <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger rounded-circle" />
            }
        }
    }

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

                        <button type="button" className="btn btn-outline-primary position-relative">
                            go
                            <i className="bi bi-chevron-right linkIcon" />
                            {renderNews()}
                        </button>
                        {/*<span>*/}
                        {/*    go*/}
                        {/*    <i className="bi bi-chevron-right linkIcon" />*/}
                        {/*</span>*/}
                    </div>
                </div>
            </Link>
        </>
    )
}
export default AppItem
