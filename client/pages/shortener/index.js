import Container from 'components/container'
import {useEffect, useState} from 'react'
import Helper from 'api/Helper'
import Constants from 'api/Constants'

const ShortenerApp = () => {
    // const {user} = useUser({})
    const [url, setUrl] = useState('')
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [shortUrl, setShortUrl] = useState('')

    useEffect(() => {
        console.log(url)
    }, [url])

    const handleUrlChange = event => {
        const val = event.target.value
        setUrl(val)
    }

    const onGenerate = async () => {
        console.log('generate')
        const ret = await Helper.post(Constants.API_SHORTENER, {url})
        console.log(ret)
        setShortUrl(`${Constants.URL_SHORTENER}/${ret.data.shortId}`)
    }

    return (
        <Container app="Shortener">
            <div className="mb-3 text-center">단축된 URL을 만들어 보세요!</div>

            <div className="row g-3 text-center align-items-center justify-content-center mb-2 col-12-sm col-8-md col-4-lg">
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="원본 URL" onChange={handleUrlChange} />
                    <button className="btn btn-primary" type="button" onClick={onGenerate} disabled={buttonDisabled}>
                        URL 생성하기
                    </button>
                </div>
            </div>

            <div className="text-center">
                <span className="text-center">{shortUrl}</span>
            </div>
        </Container>
    )
}

export default ShortenerApp
