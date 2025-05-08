import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
  }, [])

  const updateBlogs = () => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }

  const shouldDelete = (blog) => {
    return user.username === blog.user.username
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try{
      const returnedBlog = await blogService.create(blogObject)

      const blogs = await blogService.getAll()
      setBlogs(blogs)

      setMessage(`Successfully Added a new blog: ${blogObject.title} by ${blogObject.author}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception){
      setMessage('Error adding blog')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      const blogs = await blogService.getAll()
      setBlogs(blogs)

      setMessage('Successfully Logged In')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    try{
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      setMessage('Logged Out')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }catch (exception){
      setMessage('Error Logging Out')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
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
      <div>
        <Notification message={message} />
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      <p>{user.username}</p>
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.slice().sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlogs={updateBlogs} shouldDelete={shouldDelete}/>
      )}
    </div>
  )
}

export default App