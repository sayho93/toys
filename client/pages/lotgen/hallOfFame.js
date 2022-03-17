import Container from 'components/lotGen/container'
import useNumList from 'lib/useNumList'
import NumList from 'components/lotGen/numList'
import {useSelector} from 'react-redux'
import LoadingFixed from 'components/LoadingFixed'

const HallOfFame = () => {
    const searchInfo = useSelector(({search}) => search)
    const {numListData, numListSize, setNumListSize} = useNumList({id: null, type: 1, searchTxt: searchInfo.searchTxt})

    return (
        <Container>
            <h3>Hall of fame</h3>
            {numListData.isLoading && <LoadingFixed />}
            <NumList list={numListData.numList} size={numListSize} setSize={setNumListSize} />
        </Container>
    )
}

export default HallOfFame
