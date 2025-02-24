const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 20,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('the should have only 37 likes', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 37)
  })
})

describe('most liked blog', () => {
  test('the most liked blog is React patterns', () => {
    const blog = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(blog, blogs[2])
  })
})

describe('most blogs author', () => {
  test('the author with the most blogs is Edsger W. Dijkstra', () => {
    const authorObject = listHelper.mostBlogs(blogs)

    assert.strictEqual(authorObject.author, 'Edsger W. Dijkstra')
  })
})

describe('most Likes author', () => {
  test('the author with the most blogs is Michael Chan', () => {
    const authorObject = listHelper.mostLikes(blogs)

    assert.strictEqual(authorObject.author, 'Michael Chan')
  })
})