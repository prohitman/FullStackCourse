import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './components/NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] }),
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    //retry: 1,
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Anecdote service not available due to server problems</div>

  const handleVote = (anecdote) => {
    console.log('vote')
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch({ type: 'SET', payload: `new vote for anecdote: '${anecdote.content}'` })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {data.map(anecdote =>
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
  )
}

export default App
