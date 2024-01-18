import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import NotificationContext from '../NotificationContext'
import { useContext } from 'react'

const AnecdoteForm = () => {
  const [notification, dispatchNotification] = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const newAnecdote = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if ( content === '' || content.length < 5) {
      dispatchNotification({ type: "SET_NOTIFICATION", data: `too short anecdote, must have length 5 or more`})
      setTimeout(() => {
        dispatchNotification({ type: "REMOVE_NOTIFICATION" })
      }, 5000)
      return
    }
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdote.mutate({ content, votes: 0 })
    dispatchNotification({ type: "SET_NOTIFICATION", data: `a new anecdote '${content}' created!` })
    setTimeout(() => {
      dispatchNotification({ type: "REMOVE_NOTIFICATION" })
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
