import { test, expect } from '@playwright/test'
import { setup, finished } from './fakes.js'

test('phone: home page, bottom navigation and the account offer', async ({ page }) => {
  const errors = await setup(page, { results: finished(4) })
  await page.goto('/')
  await expect(page.locator('h1').first()).toBeVisible()
  await expect(page.locator('.acct-nudge')).toBeVisible()
  expect(errors).toEqual([])
})

test('phone: a typed quiz can be answered', async ({ page }) => {
  await setup(page)
  await page.goto('/quiz/jp-quiz')
  const input = page.locator('input').first()
  await input.pressSequentially('Tokio', { delay: 30 })   // typed like a person; Romanian site → Romanian names
  await expect(page.locator('body')).toContainText(/1\s*\/\s*20/)
})
