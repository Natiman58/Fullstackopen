import { useSelector } from "react-redux"
import { useReducer } from "react"
import notificationReducer from "../reducers/notificationReducer"

const Notification = () => {
  //const notification = useSelector(state => state.notification)
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  const style = {
    border: notification === '' ? 'none' : 'solid',
    padding: 10,
    borderWidth: notification === '' ? 0 : 1,
    marginBottom: 10
  }


  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification