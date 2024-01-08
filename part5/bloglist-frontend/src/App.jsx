import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Toggleble'
import CreateBlogForm from './components/CreateBlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user,  setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      loginService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      console.log(window.localStorage)
      loginService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('login successful')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleBlogCreation = async (title, url, author) => {
    event.preventDefault()
    const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
    const encodedPayload = user.token.split('.')[1]
    const decodedPayload = atob(encodedPayload)
    const payload = JSON.parse(decodedPayload)
    const userId = payload.id

    const blogObject = {
      title: title,
      url: url,
      author: author,
      likes: 0,
      user: userId
    }

    try {
      const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
      blogService.setToken(user.token)
      // hide the from after submit
      blogFormRef.current.toggleVisibility()
      const blogCreateResponse = await blogService.create(blogObject)
      setBlogs(blogs.concat(blogCreateResponse))
      setMessage(`a new blog ${title} by ${author} added`)
    } catch (exception){
      console.log(exception)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    )
  }
  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      <div>{user && user.name} logged in{' '}
        <button onClick={() => window.localStorage.removeItem('loggedBlogappUser')}>logout</button>
      </div>
      <br />
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <CreateBlogForm handleBlogCreation={handleBlogCreation} />
      </Togglable>
      <br />
      { blogs.sort((a, b) => b.likes - a.likes).map(blog => (
        <Blog key={blog.id} blog={blog} />
      )
      )}
    </div>
  )
}

export default App