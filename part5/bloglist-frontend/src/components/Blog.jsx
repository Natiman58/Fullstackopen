import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [showdetail, setShowDetail] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const buttonType = showdetail ? 'hide' : 'view'

  const updateLike = async () => {
    const updatedObject = {
      likes: likes + 1
    }
    await blogService.put(blog.id, updatedObject)
    setLikes(likes + 1)

    console.log('like updated')
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      //blogService.setToken(window.localStorage.getItem('loggedBlogappUser'))
      const loggedInUser = window.localStorage.getItem('loggedBlogappUser')
      const user = JSON.parse(loggedInUser)
      blogService.setToken(user.token)
      await blogService.deleteBlog(blog.id)
      console.log('blog deleted')
    }
  }


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogDetail = () => {
    const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
    if (user) {
      const encodedPayload = user.token.split('.')[1]
      const decodedPayload = atob(encodedPayload)
      const payload = JSON.parse(decodedPayload)
      const userId = payload.id

      const isCreatedByLoggedInUser = blog.user.id === userId
      console.log(isCreatedByLoggedInUser)

      return (
        <div>
          <div>{blog.url}</div>
          <div>{likes} <button onClick={() => updateLike()}>like</button></div>
          <div>{blog.author}</div>
          {isCreatedByLoggedInUser && (<button onClick={() => deleteBlog()}>Remove</button>)}
        </div>
      )
    } else {
      return (
        <div>
          <div>{blog.url}</div>
          <div>{likes} <button onClick={() => updateLike()}>like</button></div>
          <div>{blog.author}</div>
        </div>
      )
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <div className='blog-title'>{blog.title}</div> <div className='blog-author'>{ blog.author }</div>
        <button onClick={() => setShowDetail(!showdetail)}>{buttonType}</button>
        {showdetail && blogDetail()}
      </div>
    </div>
  )
}

export default Blog