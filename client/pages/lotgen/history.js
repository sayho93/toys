import Container from 'components/lotGen/container'
import NumList from 'components/lotGen/numList'
import useNumList from 'lib/useNumList'
import {useSelector} from 'react-redux'
import LoadingFixed from 'components/LoadingFixed'

const History = () => {
    const searchInfo = useSelector(({search}) => search)
    const {numListData, numListSize, setNumListSize} = useNumList({searchTxt: searchInfo.searchTxt})

    return (
        <Container>
            <h3>History</h3>
            {numListData.isLoading && <LoadingFixed />}
            <NumList list={numListData.numList} size={numListSize} setSize={setNumListSize} />
        </Container>
    )
}

export default History
