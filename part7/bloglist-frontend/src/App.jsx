import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import { useNotification } from './context/NotificationContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from './context/UserContext'
import { Routes, Route } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import Menu from './components/Menu'
import { Container } from 'react-bootstrap'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, dispatchNotification] = useNotification()
  const [user, dispatchUser] = useUser()

  const blogFormRef = useRef()
  const queryClient = useQueryClient()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatchUser({ type: 'LOGIN', payload: user })
      blogService.setToken(user.token)
    }
  }, [dispatchUser])

  const notify = (message) => {
    dispatchNotification({ type: 'SET', payload: message })
    setTimeout(() => dispatchNotification({ type: 'CLEAR' }), 5000)
  }

  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(
        `Successfully Added a new blog: ${newBlog.title} by ${newBlog.author}`
      )
    },
    onError: () => {
      notify('Error adding blog')
    },
  })

  const onCreate = async (newBlog) => {
    addBlogMutation.mutate(newBlog)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatchUser({ type: 'LOGIN', payload: user })
      setUsername('')
      setPassword('')

      notify('Successfully Logged In')
    } catch (exception) {
      notify('Wrong credentials')
    }
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  if (user === null) {
    return (
      <Container className="mt-4">
        <Notification message={notification} />
        <h2>Log in to application</h2>
        {loginForm()}
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <Menu />
      <Notification message={notification} />
      <h2>Blog App</h2>
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm createBlog={onCreate} />
      </Togglable>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </Container>
  )
}

export default App
