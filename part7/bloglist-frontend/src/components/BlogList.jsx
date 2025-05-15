import Blog from './Blog'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useUserValue } from '../context/UserContext'
import { ListGroup, Container, Spinner, Alert } from 'react-bootstrap'

const BlogList = () => {
  const queryClient = useQueryClient()
  const user = useUserValue()

  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const updateBlogs = () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
  }

  const shouldDelete = (blog) => {
    return user?.username === blog?.user?.username
  }

  if (isLoading)
    return (
      <Container className="mt-4">
        <Spinner animation="border" /> Loading blogs...
      </Container>
    )
  if (isError)
    return (
      <Container className="mt-4">
        <Alert variant="danger">Blog service not available</Alert>
      </Container>
    )

  return (
    <Container className="mt-4">
      <ListGroup>
        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <ListGroup.Item key={blog.id}>
              <Blog
                blog={blog}
                updateBlogs={updateBlogs}
                shouldDelete={shouldDelete}
              />
            </ListGroup.Item>
          ))}
      </ListGroup>
    </Container>
  )
}

export default BlogList
