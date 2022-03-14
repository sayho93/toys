import Container from 'components/lotGen/container'
import useNumList from 'lib/useNumList'
import NumList from 'components/lotGen/numList/numList'
import Loading from 'components/Loading'
import {useSelector} from 'react-redux'

const HallOfFame = () => {
    const searchInfo = useSelector(({search}) => search)
    const {data} = useNumList({id: null, type: 1, searchTxt: searchInfo.searchTxt})

    return (
        <Container>
            <h3>Hall of fame</h3>
            <NumList list={data.numList} />
            {data.isLoading && <Loading />}
        </Container>
    )
}

export default HallOfFame
