import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useNotificationDispatch } from '../context/NotificationContext'

const Menu = () => {
  const [user, dispatchUser] = useUser()
  const dispatchNotification = useNotificationDispatch()

  const notify = (message) => {
    dispatchNotification({ type: 'SET', payload: message })
    setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 5000)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      dispatchUser({ type: 'LOGOUT', payload: null })
      notify('Logged Out')
    } catch {
      notify('Error Logging Out')
    }
  }

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>Blog App</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Blogs
          </Nav.Link>
          <Nav.Link as={Link} to="/users">
            Users
          </Nav.Link>
        </Nav>
        <Navbar.Text className="me-2">{user.name} logged in</Navbar.Text>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    </Navbar>
  )
}

export default Menu
