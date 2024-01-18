import AnecdoteForm from './components/AnecdoteForm'
import Notification, { notificationReducer } from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import NotificationContext from './NotificationContext'
import { useReducer } from 'react'


const App = () => {
  const [notification, dispatchNotification] = useReducer(notificationReducer, null)
  const queryClient = useQueryClient()
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updateAnecdote) => {
      //queryClient.invalidateQueries('anecdotes')
      const previousAnecdotes = queryClient.getQueryData(['anecdotes'])
      const newAnecdotes = previousAnecdotes.map(anecdote => anecdote.id === updateAnecdote.id ? updateAnecdote : anecdote)
      queryClient.setQueryData(['anecdotes'], newAnecdotes)
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  })
  console.log(JSON.parse(JSON.stringify(result)))
  if(result.isLoading){
    return <div>Loading...</div>
  } else if(result.isError){
    return <div>{result.error}</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    console.log('vote')
    const anecdotetoUpdate = queryClient.getQueryData(['anecdotes']).find(a => a.id === anecdote.id)
    updateAnecdoteMutation.mutate({ ...anecdotetoUpdate, votes: anecdotetoUpdate.votes + 1 })

    dispatchNotification({ type: "SET_NOTIFICATION", data: `you voted '${anecdote.content}'` })
    setTimeout(() => {
      dispatchNotification({ type: "REMOVE_NOTIFICATION" })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={[notification, dispatchNotification]}>
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>

    </NotificationContext.Provider>
  )
}

export default App
