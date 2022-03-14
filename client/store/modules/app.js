import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentApp: 'Home',
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setCurrentApp: (state, action) => {
            state.currentApp = action.payload
        },
    },
})

export const {setCurrentApp, setUserInfo} = appSlice.actions
export default appSlice.reducer
