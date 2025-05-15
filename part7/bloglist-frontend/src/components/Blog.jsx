import blogService from '../services/blogs'
import { useMutation } from '@tanstack/react-query'
import { useNotificationDispatch } from '../context/NotificationContext'
import { Link } from 'react-router-dom'
import { Button, Row, Col } from 'react-bootstrap'

const Blog = ({ blog, updateBlogs, shouldDelete }) => {
  const dispatch = useNotificationDispatch()

  const notify = (message) => {
    dispatch({ type: 'SET', payload: message })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      updateBlogs()
      notify(`Successfully deleted: ${blog.title} by ${blog.author}`)
    },
    onError: () => {
      notify('Failed to delete blog')
    },
  })

  const likeMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(blog.id, updatedBlog),
    onSuccess: () => {
      updateBlogs()
    },
  })

  const handleDelete = (e) => {
    e.preventDefault()
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id)
    }
  }

  return (
    <Row className="align-items-center justify-content-between">
      <Col>
        <Link to={`/blogs/${blog.id}`} className="fw-bold text-decoration-none">
          {blog.title}
        </Link>
      </Col>
      {shouldDelete(blog) && (
        <Col xs="auto">
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Remove
          </Button>
        </Col>
      )}
    </Row>
  )
}

export default Blog
