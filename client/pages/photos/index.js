import Container from 'components/container'
import {useSelector} from 'react-redux'
import useUser from 'lib/useUser'
import Uploader from 'components/photos/uploader'
import {useEffect, useState} from 'react'

import {createWorker} from 'tesseract.js'
import LoadingFixed from 'components/LoadingFixed'
import Helper from 'api/Helper'
import Constants from 'api/Constants'
import usePhotoList from 'lib/usePhotoList'
import PhotoList from 'components/photos/photoList'
import DetailModal from 'components/photos/detailModal'

const PhotosApp = () => {
    const {user} = useUser()
    const searchInfo = useSelector(({search}) => search)

    const [file, setFile] = useState([])
    const [fileInfo, setFileInfo] = useState({})
    const [loading, setLoading] = useState(false)
    const [ocrLoading, setOcrLoading] = useState(false)
    const [ocrText, setOcrText] = useState('')

    const {photoListData, mutatePhotoList, photoListSize, setPhotoListSize} = usePhotoList({
        id: user && user.isLoggedIn ? user.id : -1,
        searchTxt: searchInfo.searchTxt,
    })

    const [detailId, setDetailId] = useState(null)
    const [detail, setDetail] = useState(null)

    const scanImg = async () => {
        if (!file.length) {
            alert('사진을 선택해주세요.')
            return
        }

        const worker = createWorker({
            logger: m => {
                // setOcrProgress(parseInt((parseFloat(m.progress) / 1) * 100))
                console.log(m)
            },
        })

        try {
            await worker.load()
            await worker.loadLanguage('kor+chi_tra')
            await worker.initialize('kor+chi_tra')
            const {
                data: {text},
            } = await worker.recognize(file[0], {
                tessedit_char_whitelist: '0123456789',
            })
            setOcrText(text)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        console.log(fileInfo)
    }, [fileInfo])

    useEffect(() => {
        console.log(file)
    }, [file])

    const onOCR = async () => {
        setOcrLoading(true)
        await scanImg()
        setOcrLoading(false)
    }

    const onSave = async () => {
        setLoading(true)
        const params = {
            fileId: fileInfo.fileId,
            userId: user.id,
            ocrText,
        }

        const ret = await Helper.post(Constants.API_PHOTO, params)
        console.log(ret)
        if (ret) {
            setFile([])
            setFileInfo({})
            setOcrText('')
        }

        setLoading(false)
    }

    const onListItemClick = async id => {
        setDetailId(id)
        const ret = await Helper.get(`${Constants.API_PHOTO}/${id}`)
        if (ret) {
            setDetail(ret)
        }
    }

    return (
        <Container app="Photos">
            {user && user.isLoggedIn ? (
                <>
                    <Uploader
                        file={file}
                        info={fileInfo}
                        setInfo={setFileInfo}
                        setFile={setFile}
                        ocrText={ocrText}
                        setOcrText={setOcrText}
                        onOCR={onOCR}
                        onSave={onSave}
                        loading={loading}
                        ocrLoading={ocrLoading}
                    />
                    {photoListData.isLoading && <LoadingFixed />}
                    <PhotoList list={photoListData.data} size={photoListSize} setSize={setPhotoListSize} onClick={onListItemClick} />
                    {detailId && <DetailModal detail={detail} setDetail={setDetail} setDetailId={setDetailId} />}
                </>
            ) : (
                <p className="mt-5 text-center">로그인 후 이용해 주세요.</p>
            )}
            {/*{ocrLoading && <LoadingFixed />}*/}
        </Container>
    )
}

export default PhotosApp
