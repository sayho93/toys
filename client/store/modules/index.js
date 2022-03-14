import {combineReducers} from '@reduxjs/toolkit'
import {HYDRATE} from 'next-redux-wrapper'
import test from 'store/modules/test'
import app from 'store/modules/app'
import search from 'store/modules/search'

const reducer = (state, action) => {
    if (action.type === HYDRATE) {
        return {
            ...state,
            ...action.payload,
        }
    }

    return combineReducers({
        test,
        app,
        search,
    })(state, action)
}

export default reducer
