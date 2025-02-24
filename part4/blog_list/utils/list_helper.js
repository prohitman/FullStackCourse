const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((mostLikedBlog, blog) => blog.likes > mostLikedBlog.likes ? blog : mostLikedBlog, blogs[0])
}

const mostBlogs = (blogs) => {
  const authors = []

  blogs.forEach((blog) => {
    const existingAuthor = authors.find((authorObject) => authorObject.author === blog.author)
    if (existingAuthor) {
      existingAuthor.count++
    } else {
      authors.push({ author: blog.author, count: 1 })
    }
  })

  mostBlogsAuthor = authors.reduce((mostBlogsAuthor, authorObject) => mostBlogsAuthor.count < authorObject.count ? authorObject : mostBlogsAuthor, authors[0])

  return mostBlogsAuthor
}

const mostLikes = (blogs) => {
  const authors = []

  blogs.forEach((blog) => {
    const existingAuthor = authors.find((authorObject) => authorObject.author === blog.author)
    if (existingAuthor) {
      existingAuthor.likes += blog.likes
    } else {
      authors.push({ author: blog.author, likes: blog.likes })
    }
  })

  mostLikesAuthor = authors.reduce((mostLikesAuthor, authorObject) => mostLikesAuthor.likes < authorObject.likes ? authorObject : mostLikesAuthor, authors[0])

  return mostLikesAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}