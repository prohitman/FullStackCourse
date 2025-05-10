import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <div key={anecdote.id}>
        <div>
        {anecdote.content}
        </div>
        <div>
            has {anecdote.votes}
            <button onClick={handleClick}>vote</button>
        </div>
    </div>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  )
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return(
    <ul>
      {sortedAnecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(voteAnecdote(anecdote))
            dispatch(setNotification(`You voted for: ${anecdote.content}`, 5))
          }
          }
        />
      )}
    </ul>
  )
}

export default Anecdotes