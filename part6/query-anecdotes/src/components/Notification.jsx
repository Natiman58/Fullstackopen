import { useReducer } from "react"
import NotificationContext from "../NotificationContext"
import { useContext } from "react"

export const notificationReducer = (state, action) => {
  switch(action.type){
    case "SET_NOTIFICATION":
      return action.data
    case "REMOVE_NOTIFICATION":
      return null

    default:
      return state

  }
}


const Notification = () => {
  const [notification] = useContext(NotificationContext)


  const style = {
    borderStyle: notification ? 'solid' : 'none',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  //if (true) return null

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
