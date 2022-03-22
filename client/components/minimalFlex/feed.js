import dynamic from 'next/dynamic'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
const Fab = dynamic(() => import('react-tiny-fab').then(mod => mod.Fab), {ssr: false})
import 'react-tiny-fab/dist/styles.css'
import Card from 'components/minimalFlex/card'
import {useCallback, useEffect, useRef, useState} from 'react'
import Helper from 'api/Helper'
import Constants from 'api/Constants'
import WriteModal from 'components/minimalFlex/writeModal'
import {useRouter} from 'next/router'
import {toast, ToastContainer} from 'react-toastify'

const Feed = ({list, mutateList, listSize, setListSize, user}) => {
    const router = useRouter()
    const [writeInfo, setWriteInfo] = useState({fileId: 0, content: ''})
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const loader = useRef(null)

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '10px',
            threshold: 0.25,
        }
        const observer = new IntersectionObserver(observerHandler, option)
        if (loader.current) observer.observe(loader.current)
        return () => observer.disconnect()
    }, [list])

    const observerHandler = useCallback(
        entries => {
            const target = entries[0]
            if (target.isIntersecting) {
                if (list && list[0].length && list[0].length === 15) {
                    if (list[list.length - 1].length !== 15) toast.success('더이상 불러올 데이터가 없습니다.')
                    else setListSize(listSize + 1)
                }
            }
        },
        [list]
    )

    const onFABClick = () => {
        if (user && user.id) setModalOpen(true)
        else toast.error('로그인이 필요합니다.')
    }

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

    const onClick = async id => await router.push(`/minimalFlex/article?id=${id}`)

    return (
        <>
            {modalOpen && <WriteModal loading={loading} onSave={onSave} onClose={() => setModalOpen(false)} info={writeInfo} setInfo={setWriteInfo} />}
            <Fab color="primary" icon={<i className="bi bi-pencil-fill" />} event={false} onClick={onFABClick} />
            {list && (
                <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1400: 4}}>
                    <Masonry>{list.map(row => row.map(item => <Card key={item.id} data={item} onClick={onClick} />))}</Masonry>
                </ResponsiveMasonry>
            )}

            {(!list || !list[0].length) && <p className="text-center">데이터가 없습니다...</p>}

            <div className="w-100 mb-3 observerRef" ref={loader} />
            <style jsx>{`
                .observerRef {
                    height: 1rem;
                }
            `}</style>

            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnVisibilityChange
                draggable
                pauseOnHover
                closeButton={false}
                style={{textAlign: 'center', fontSize: '0.8rem'}}
                theme="dark"
                limit={3}
            />
        </>
    )
}

export default Feed
