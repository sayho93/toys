import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentApp: 'Home',
    searchTxt: null,
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchInfo: (state, action) => {
            state.currentApp = action.payload.currentApp
            state.searchTxt = action.payload.searchTxt
        },
    },
})

export const {setSearchInfo} = searchSlice.actions
export default searchSlice.reducer
