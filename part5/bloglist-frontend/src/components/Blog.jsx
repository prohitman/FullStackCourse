import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogs, shouldDelete }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const canDelete = { display: shouldDelete(blog) ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleDelete = (event) => {
    event.preventDefault()

    if (
      window.confirm(
        `Are you sure you want to remove ${blog.title} by ${blog.author}?`
      )
    ) {
      blogService
        .deleteBlog(blog.id)
        .then((a) => {
          updateBlogs()
        })
        .catch((error) => {
          console.log('failed to delete blog')
          console.log(blog.id)
        })
    }
  }

  const handleLike = (event) => {
    event.preventDefault()
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }

    blogService
      .update(blog.id, newBlog)
      .then((returnedBlog) => {
        console.log(returnedBlog)
        updateBlogs()
      })
      .catch((error) => {
        console.log('fail')
      })
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <li className='blog' data-testid='blog'>
      <div style={blogStyle}>
        {blog.title} <br />
        {blog.author} <br />
        <div style={hideWhenVisible}>
          <button onClick={toggleVisibility}>show</button>
        </div>
        <div style={showWhenVisible}>

          URL: {blog.url} <br />
          Likes: {blog.likes} <br /> <button onClick={handleLike}>like</button>
          User: {blog.user.name}
          <button onClick={toggleVisibility}>hide</button>
          <div style={canDelete}>
            <button onClick={handleDelete}>remove</button>
          </div>
        </div>
      </div>
    </li>
  )
}
export default Blog
