import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notificationChange(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
        return ''
    }
  },
})


export const setNotification = (notification, time) => {
    return dispatch => {
        dispatch(notificationChange(notification))
        setTimeout(()=> {dispatch(removeNotification())}, time*1000)
    }
}

export const { notificationChange, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer