import Generator from 'components/lotGen/generator/generator'
import {useState} from 'react'
import NumList from 'components/lotGen/numList/numList'
import Container from 'components/lotGen/container'
import lotteryUtils from 'utils/lottery'
import Helper from 'api/Helper'
import Constants from 'api/Constants'
import useUser from 'lib/useUser'
import useNumList from 'lib/useNumList'
import Loading from 'components/Loading'
import {useSelector} from 'react-redux'

const LotGenApp = () => {
    const {user} = useUser({})
    const searchInfo = useSelector(({search}) => search)

    const {data, mutateNumList} = useNumList({
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
        if (/^\d+$/.test(event.target.value)) {
            const tmp = [...lot]
            const idx = event.target.dataset.idx
            if (event.target.value > 45) tmp[idx] = 45
            else if (event.target.value < 1) tmp[idx] = 1
            else tmp[idx] = +event.target.value
            setLot(tmp)
        }
    }

    const onNumSave = async () => {
        setSaveStatus({loading: true, btnDisabled: true})
        let errMsg = null
        if (!user.isLoggedIn) errMsg = '로그인 후 이용해 주세요.'

        const filtered = lot.filter(num => typeof num === 'number').length
        if (filtered === 0) errMsg = 'Nothing to save'
        else if (filtered < 6) errMsg = 'Not enough numbers'

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
            {data.isLoading && <Loading />}
            <NumList list={data.numList} />
        </Container>
    )
}

export default LotGenApp
