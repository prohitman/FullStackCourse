import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('calls createBlog with correct details on form submit', async () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  const titleInput = screen.getByPlaceholderText('write title here')
  const authorInput = screen.getByPlaceholderText('write author here')
  const urlInput = screen.getByPlaceholderText('write url here')
  const submitButton = screen.getByText('save')

  await user.type(titleInput, 'React Testing')
  await user.type(authorInput, 'Tester')
  await user.type(urlInput, 'https://test.com')
  await user.click(submitButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'React Testing',
    author: 'Tester',
    url: 'https://test.com',
    important: true,
  })
})