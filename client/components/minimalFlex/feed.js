import dynamic from 'next/dynamic'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
const Fab = dynamic(() => import('react-tiny-fab').then(mod => mod.Fab), {ssr: false})
import 'react-tiny-fab/dist/styles.css'
import Card from 'components/minimalFlex/card'
import {useState} from 'react'
import Helper from 'api/Helper'
import Constants from 'api/Constants'
import WriteModal from 'components/minimalFlex/writeModal'
import useUser from 'lib/useUser'

const Feed = ({list, mutateList, listSize, setListSize, setOpen, userId}) => {
    const {user} = useUser()
    const [writeInfo, setWriteInfo] = useState({fileId: 0, content: ''})
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSave = async () => {
        setLoading(true)
        const params = {...writeInfo, userId: user.id}
        const res = await Helper.post(Constants.API_ARTICLE_SAVE, params)
        if (res) {
            await mutateList()
            setLoading(false)
            setWriteInfo({fileId: 0, content: ''})
            setLoading(false)
            setModalOpen(false)
        }
    }

    return (
        <>
            {modalOpen && <WriteModal loading={loading} onSave={onSave} onClose={() => setModalOpen(false)} info={writeInfo} setInfo={setWriteInfo} />}
            {list && (
                <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1400: 4}}>
                    <Masonry>{list.map(row => row.map(item => <Card key={item.id} data={item} />))}</Masonry>
                </ResponsiveMasonry>
            )}
            <Fab color="primary" icon={<i className="bi bi-pencil-fill" />} event={false} onClick={() => setModalOpen(true)} />
        </>
    )
}

export default Feed
