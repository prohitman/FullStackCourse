import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Testing',
    author: 'Jane--Tester',
    url: 'http://example.com',
    likes: 5,
    user: {
      id: '123',
      name: 'Test User'
    },
    important: true
  }

  const mockUpdateBlogs = vi.fn()
  const mockShouldDelete = vi.fn(() => false)

  const { container } = render(
    <Blog
      blog={blog}
      updateBlogs={mockUpdateBlogs}
      shouldDelete={mockShouldDelete}
    />
  )

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('Testing')
  expect(screen.queryByText('http://example.com')).not.toBeInTheDocument()
  expect(screen.queryByText(5)).not.toBeInTheDocument()
})

test('displays URL and likes when the "show" button is clicked', async () => {
  const blog = {
    title: 'Testing',
    author: 'Jane--Tester',
    url: 'http://example.com',
    likes: 5,
    user: {
      id: '123',
      name: 'Test User'
    },
    important: true
  }

  const mockUpdateBlogs = vi.fn()
  const mockShouldDelete = vi.fn(() => false)

  const { container } = render(
    <Blog
      blog={blog}
      updateBlogs={mockUpdateBlogs}
      shouldDelete={mockShouldDelete}
    />
  )

  const user = userEvent.setup()
  const showButton = screen.getByText('show')
  await user.click(showButton)

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('http://example.com')
  expect(div).toHaveTextContent(5)
})

test('calls updateBlogs twice when "like" button is clicked twice', async () => {
  const blog = {
    title: 'Testing',
    author: 'Jane--Tester',
    url: 'http://example.com',
    likes: 5,
    user: {
      id: '123',
      name: 'Test User'
    },
    important: true
  }

  const mockUpdateBlogs = vi.fn()
  const mockShouldDelete = vi.fn(() => false)

  blogService.update.mockResolvedValue({
    ...blog,
    likes: blog.likes + 1,
  })

  render(
    <Blog
      blog={blog}
      updateBlogs={mockUpdateBlogs}
      shouldDelete={mockShouldDelete}
    />
  )

  const user = userEvent.setup()
  await user.click(screen.getByText('show'))
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockUpdateBlogs).toHaveBeenCalledTimes(2)
})