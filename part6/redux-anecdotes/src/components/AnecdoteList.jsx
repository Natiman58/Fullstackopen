import { useDispatch, useSelector } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { setTimedNotification } from "../reducers/notificationReducer"
import anecdoteService from "../services/anecdotes"


const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ anecdotes, filter }) => {
        if (filter === ''){
            return anecdotes
        }
        return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    })

    const vote = async (id) => {
        const anecdote = anecdotes.find(anecdote => anecdote.id === id)
        const changedAnecdote = {...anecdote, votes: anecdote.votes + 1}
        await anecdoteService.update(id, changedAnecdote)
        dispatch(voteAnecdote(changedAnecdote.id))
        dispatch(setTimedNotification(`you voted '${anecdote.content}'`, 5))
    }

    return (
        <>
            {[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote =>
                <div key={anecdote.id}>
                    <div> {anecdote.content} </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AnecdoteList