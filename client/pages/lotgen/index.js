import Generator from 'components/lotGen/generator/generator'
import {useState} from 'react'
import NumList from 'components/lotGen/numList/numList'
import Container from 'components/lotGen/container'
import lotteryUtils from 'utils/lottery'
import Helper from 'api/Helper'
import Constants from 'api/Constants'
import useUser from 'lib/useUser'
import useNumList from 'lib/useNumList'
import {useSelector} from 'react-redux'
import LoadingFixed from 'components/LoadingFixed'

const LotGenApp = () => {
    const {user} = useUser({})
    const searchInfo = useSelector(({search}) => search)

    const {numListData, mutateNumList, numListSize, setNumListSize} = useNumList({
        id: user && user.isLoggedIn ? user.id : -1,
        type: 0,
        searchTxt: searchInfo.searchTxt,
    })

    const [lot, setLot] = useState(Array(6).fill(''))

    const [saveStatus, setSaveStatus] = useState({loading: false, btnDisabled: false})

    const onGenerate = () => {
        const list = []
        Array(6)
            .fill(0)
            .forEach(() => list.push(Math.floor(Math.random() * 45) + 1))
        const set = new Set(list)
        if (set.size < 6) onGenerate()
        else {
            list.sort((a, b) => a - b)
            setLot(list)
        }
    }

    const handleNumChange = event => {
        const tmp = [...lot]
        const idx = event.target.dataset.idx
        if (/^\d+$/.test(event.target.value)) {
            if (event.target.value > 45) tmp[idx] = 45
            else if (event.target.value < 1) tmp[idx] = 1
            else tmp[idx] = +event.target.value
        } else {
            tmp[idx] = ''
        }
        setLot(tmp)
    }

    const onNumSave = async () => {
        setSaveStatus({loading: true, btnDisabled: true})
        let errMsg = null

        const filtered = lot.filter(num => typeof num === 'number').length
        const set = new Set(lot)
        if (!user || !user.isLoggedIn) errMsg = '로그인 후 이용해 주세요.'
        else if (filtered === 0) errMsg = '숫자를 입력해 주세요.'
        else if (filtered < 6) errMsg = '6개의 숫자를 입력해 주세요.'
        else if (set.size < 6) errMsg = '중복된 숫자가 있습니다.'

        if (errMsg) {
            alert(errMsg)
            setSaveStatus({loading: false, btnDisabled: false})
            return
        }

        const insertId = await Helper.post(`${Constants.API_SAVE_NUM}/${user.id}`, {
            roundNo: lotteryUtils.getWeek(),
            numList: lot.sort((a, b) => a - b),
        })

        if (!insertId) alert('Error saving numbers')
        else {
            await mutateNumList()
            setLot(Array(6).fill(''))
        }
        setSaveStatus({loading: false, btnDisabled: false})
    }

    return (
        <Container>
            <Generator
                loading={saveStatus.loading}
                user={user}
                onGenerate={onGenerate}
                numList={lot}
                onChange={handleNumChange}
                onSave={onNumSave}
                week={lotteryUtils.getWeek()}
                disabled={saveStatus.btnDisabled}
            />
            {numListData.isLoading && <LoadingFixed />}
            {user && user.isLoggedIn ? (
                <NumList list={numListData.numList} size={numListSize} setSize={setNumListSize} />
            ) : (
                <p className="mt-5 text-center">로그인 후 이용해 주세요.</p>
            )}
        </Container>
    )
}

export default LotGenApp
