import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET': return action.payload
    case 'CLEAR': return ''
    default: return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const counterAndDispatch = useContext(NotificationContext)
  return counterAndDispatch[0]
}
  
export const useNotificationDispatch = () => {
  const counterAndDispatch = useContext(NotificationContext)
  return counterAndDispatch[1]
}

export const useNotification = () => useContext(NotificationContext)