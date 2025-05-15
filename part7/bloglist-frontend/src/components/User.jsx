import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { ListGroup } from 'react-bootstrap'

const User = () => {
  const { id } = useParams()

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  const user = users?.find((u) => u.id === id)

  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <h4 className="mt-4">Added Blogs</h4>
      <ListGroup className="mt-2">
        {user.blogs.map((blog) => (
          <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default User
