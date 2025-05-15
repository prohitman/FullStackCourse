import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../context/NotificationContext'
import { useState } from 'react'
import { Container, Button, Form, Card, ListGroup } from 'react-bootstrap'

const BlogView = () => {
  const [comment, setComment] = useState('')
  const { id } = useParams()
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const notify = (message) => {
    dispatch({ type: 'SET', payload: message })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  const { data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const blog = blogs?.find((b) => b.id === id)

  const likeMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(blog.id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      notify('Comment added!')
      setComment('')
    },
  })

  const handleLike = (e) => {
    e.preventDefault()
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    likeMutation.mutate(newBlog)
  }

  const handleComment = (e) => {
    e.preventDefault()
    commentMutation.mutate({ id: blog.id, comment })
  }

  if (!blog) return null

  return (
    <Container className="my-4">
      <Card>
        <Card.Body>
          <Card.Title>{blog.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            by {blog.author}
          </Card.Subtitle>
          <Card.Text>
            <strong>URL:</strong> <a href={blog.url}>{blog.url}</a>
            <br />
            <strong>Likes:</strong> {blog.likes}{' '}
            <Button variant="outline-primary" size="sm" onClick={handleLike}>
              Like
            </Button>
            <br />
            <strong>Added by:</strong> {blog.user?.name}
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Comments</Card.Title>
          <Form onSubmit={handleComment} className="mb-3">
            <Form.Group className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={({ target }) => setComment(target.value)}
              />
              <Button type="submit" variant="primary">
                Add Comment
              </Button>
            </Form.Group>
          </Form>
          <ListGroup variant="flush">
            {blog.comments.map((c, i) => (
              <ListGroup.Item key={i}>{c}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default BlogView
