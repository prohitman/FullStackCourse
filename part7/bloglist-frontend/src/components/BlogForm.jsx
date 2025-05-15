import { useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      important: true,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Create a New Blog</Card.Title>
        <Form onSubmit={addBlog}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Write title here"
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAuthor">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              placeholder="Write author here"
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formUrl">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Write URL here"
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default BlogForm
