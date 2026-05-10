import { test, expect } from '@playwright/test'

test.describe('Smoke — all routes load without errors', () => {
  test('homepage loads with key content', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/EverydayAI Tutor/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Learn AI')
    await expect(page.getByText('Practical AI for Everyday People').first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Subscribe on YouTube/i }).first()).toBeVisible()
  })

  test('/videos loads page heading', async ({ page }) => {
    await page.goto('/videos')
    await expect(page.getByRole('heading', { name: 'Videos', level: 1 })).toBeVisible()
  })

  test('/blog loads page heading', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible()
  })

  test('/about loads page heading', async ({ page }) => {
    await page.goto('/about')
    await expect(
      page.getByRole('heading', { name: 'About EverydayAI Tutor', level: 1 }),
    ).toBeVisible()
  })

  test('/privacy loads page heading', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible()
  })

  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Back to home/i })).toBeVisible()
  })
})
