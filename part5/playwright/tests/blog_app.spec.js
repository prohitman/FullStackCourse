const { test, expect, beforeEach, describe } = require('@playwright/test')
import { loginWith, createBlog } from './helper'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('')
  })

  describe('Login', () => {
    test('Login form is shown', async ({ page }) => {
      await expect(page.getByTestId('username')).toBeVisible()
      await expect(page.getByTestId('password')).toBeVisible()
      await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Successfully Logged In')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

  describe('When Logged In', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'www.testurl.com/')
      await expect(page.getByText('Successfully Added a new blog: Test Title by Test Author')).toBeVisible()
    })

    test('blogs are ordered by number of likes in descending order', async ({ page }) => {     
      test.setTimeout(10000) 
      await createBlog(page, 'Blog One', 'Author A', 'url1.com')
      await createBlog(page, 'Blog Two', 'Author B', 'url2.com')
      await createBlog(page, 'Blog Three', 'Author C', 'url3.com')
 
      const showButtons = await page.getByText('show').all()
      for (const btn of showButtons) {
        await btn.click()
      }

      const blogTwo = page.getByText('Blog Two').locator('..')
      const likeButtonTwo = blogTwo.getByRole('button', { name: 'like' })
      for (let i = 0; i < 3; i++) {
        await likeButtonTwo.click()
        await page.waitForTimeout(100)
      }

      const blogOne = page.getByText('Blog One').locator('..')
      const likeButtonOne = blogOne.getByRole('button', { name: 'like' })
      await likeButtonOne.click()
      await page.waitForTimeout(100)

      const blogs = await page.locator('[data-testid="blog"]').all()

      await expect(blogs[0].getByText('Blog Two')).toBeVisible()
      await expect(blogs[1].getByText('Blog One')).toBeVisible()
      await expect(blogs[2].getByText('Blog Three')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Test Title', 'Test Author', 'www.testurl.com/')
      })

      test('user can like a blog', async ({ page }) => {
        await page.getByText('show').click()
        const likeButton = page.getByRole('button', { name: 'like' })
        await likeButton.click()
        await expect(page.getByText('Likes: 1')).toBeVisible()
      })

      test('user can delete a blog they created', async ({ page }) => {
        await page.getByText('show').click()
        page.once('dialog', async (dialog) => {
            await dialog.accept()
        })
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByTestId('blog')).not.toBeVisible()
      })

      test('user can only view a blog that they created', async ({ page, request }) => {
        await request.post('/api/users', {
            data: {
              name: 'Other User',
              username: 'othersuser',
              password: 'user123',
            },
        })
        
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'othersuser', 'user123')
        await page.getByText('show').click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
  })
})