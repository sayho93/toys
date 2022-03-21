import dynamic from 'next/dynamic'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
const Fab = dynamic(() => import('react-tiny-fab').then(mod => mod.Fab), {ssr: false})
import 'react-tiny-fab/dist/styles.css'
import Card from 'components/minimalFlex/card'

const Feed = ({list, setOpen}) => {
    return (
        <>
            {list && (
                <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1400: 4}}>
                    <Masonry>
                        {list.map(row => row.map(item => <Card key={item.id} data={item} />))}
                        <div />
                    </Masonry>
                </ResponsiveMasonry>
            )}

            <Fab color="primary" icon={<i className="bi bi-pencil-fill" />} event={false} onClick={() => setOpen(true)} />
        </>
    )
}

export default Feed
