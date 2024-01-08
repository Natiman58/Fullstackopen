import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
        username
          <input
            id='username'
            type="text"
            name="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
        password
          <input
            id='password'
            type="password"
            name="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired
}

export default LoginForm