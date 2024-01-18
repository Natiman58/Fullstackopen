import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action){
            return action.payload
        },
        removeNotification(state, action){
            return ''
        }
    }
})

export const { setNotification, removeNotification } = notificationSlice.actions

// Redux thunk action creator
export const setTimedNotification = (message, time) => {
    return async dispatch => {
        dispatch(setNotification(message))
        setTimeout(() => {
            dispatch(removeNotification())
        }, time * 1000) // convert time to milliseconds
    }
}


export default notificationSlice.reducer