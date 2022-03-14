import Container from 'components/lotGen/container'
import NumList from 'components/lotGen/numList/numList'
import useNumList from 'lib/useNumList'
import Loading from 'components/Loading'
import {useSelector} from 'react-redux'

const History = () => {
    const searchInfo = useSelector(({search}) => search)
    const {data} = useNumList({searchTxt: searchInfo.searchTxt})

    return (
        <Container>
            <h3>History</h3>
            <NumList list={data.numList} />
            {data.isLoading && <Loading />}
        </Container>
    )
}

export default History
