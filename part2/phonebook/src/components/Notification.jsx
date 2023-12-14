const Notification = ({message, type}) =>{
    if (message === null || type === null){
        return null
    }
    const notificationStyle = {
        color: type === 'success' ? 'green' : 'red',
        border: type === 'success' ? '3px solid green' : '3px solid red',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        backgroundColor: 'lightgrey',
    };

    return (
        <div style={notificationStyle}>{message}</div>
    )
}

export default Notification