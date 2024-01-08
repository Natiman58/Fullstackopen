import { useState } from 'react'

const CreateBlogForm =  ({ handleBlogCreation }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl]     = useState('')

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={() => handleBlogCreation(title, author, url).then(setAuthor(''), setTitle(''), setUrl(''))}>
        <div>
            title:
          <input
            id='title'
            type="text"
            name='title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
            author:
          <input
            id='author'
            type="text"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
            url:
          <input
            id='url'
            type="url"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <br />
        <button id='create-button'>create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm