const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const mystyle = {
    color: message.includes('wrong') ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    border: '3px solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div className="error" style={mystyle}>
      {message}
    </div>
  )

}
export default Notification