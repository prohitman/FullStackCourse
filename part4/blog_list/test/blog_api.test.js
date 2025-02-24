const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
require('express-async-errors')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
  await User.insertMany(helper.initialUsers)
})

describe('Handling Users', () => {
  test('Username must be present', async () => {
    const newUser = {
      name: 'test',
      password: 'pw'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
  test('Password must be present', async () => {
    const newUser = {
      username: 'test',
      name: 'test'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('Username must be at least 3 chars long', async () => {
    const newUser = {
      username: 'te',
      name: 'test',
      password: 'test'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('Password must be at least 3 chars long', async () => {
    const newUser = {
      username: 'test',
      name: 'test',
      password: 'te'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
})

describe('Handling Blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unique identifier property of blog posts is named id', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0
    }

    const savedBlog = await new Blog(newBlog).save()

    const response = await api
      .get(`/api/blogs/${savedBlog._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.id, savedBlog._id.toString())
  })

  test.only('a valid blog can be added', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0
    }

    const token = await helper.getToken()
    console.log(`Generated token: ${token}`)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()

    const titles = blogs.map(r => r.title)

    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
    assert(titles.includes('TDD harms architecture'))
  })

  test('blog without likes defaults to 0', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    const sentBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title)

    assert.strictEqual(sentBlog.likes, 0)
  })

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })


  test('blog without title or url', async () => {
    const newBlogNoTitle = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlogNoTitle)
      .expect(400)

    const response1 = await api.get('/api/blogs')

    assert.strictEqual(response1.body.length, helper.initialBlogs.length)

    const newBlogNoURL = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlogNoURL)
      .expect(400)

    const response2 = await api.get('/api/blogs')

    assert.strictEqual(response2.body.length, helper.initialBlogs.length)
  })

  test('updates the number of likes for a blog post', async () => {
    const blogs = await Blog.find({})

    const blogToUpdate = blogs[0]

    const updatedBlog = { ...blogToUpdate, likes: 5 }

    await api
      .put(`/api/blogs/${blogToUpdate._id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get(`/api/blogs/${blogToUpdate.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, updatedBlog.likes)
  })
})



after(async () => {
  await mongoose.connection.close()
})