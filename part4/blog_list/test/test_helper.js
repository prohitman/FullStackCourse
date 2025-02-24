const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 20,
    user: '67bc95ea0a6e5e6615c00db5'
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '67bc95ea0a6e5e6615c00db6'
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: '67bc95ea0a6e5e6615c00db5'
  }
]

const initialUsers = [
  {
    username: 'hellas',
    name: 'Arto Hellas',
    passwordHash: 'hell123',
    blogs: [
      '67bc95ea0a6e5e6615c00db1',
      '67bc95ea0a6e5e6615c00db3'
    ]
  },
  {
    username: 'testMan',
    name: 'Test Man',
    passwordHash: 'test123',
    blogs: [
      '67bc95ea0a6e5e6615c00db2'
    ]
  }
]

const getToken = async () => {
  const user = await User.findOne({ username: 'testMan' })
  if (!user) {
    throw new Error('User not found')
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  return jwt.sign(userForToken, process.env.SECRET)
}

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb, getToken
}