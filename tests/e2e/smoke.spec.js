import { test, expect } from '@playwright/test'
import { setup, createRealtime, finished } from './fakes.js'

test('home page loads without errors', async ({ page }) => {
  const errors = await setup(page)
  await page.goto('/')
  await expect(page.locator('h1').first()).toBeVisible()
  await expect(page.locator('.hp-duel')).toBeVisible()
  expect(errors).toEqual([])
})

test('the main pages open without errors', async ({ page }) => {
  const errors = await setup(page)
  for (const path of ['/quiz', '/countries', '/countries/romania', '/play/mountains', '/play/name-all', '/profile', '/privacy', '/quiz/duel']) {
    await page.goto(path)
    await page.waitForTimeout(1500)
  }
  expect(errors).toEqual([])
})

test('a typed quiz: answer, give up, six recommendations', async ({ page }) => {
  await setup(page)
  await page.goto('/quiz/jp-quiz')
  const input = page.locator('input').first()
  await input.pressSequentially('Tokio', { delay: 30 })   // typed like a person; Romanian site → Romanian names
  await expect(page.locator('body')).toContainText(/1\s*\/\s*20/)
  await page.getByRole('button', { name: /Renunță/ }).click()
  await page.getByRole('button', { name: /Apasă din nou/ }).click()
  await expect(page.locator('.trynext-card')).toHaveCount(6)
})

test('a country map quiz accepts alternate spellings', async ({ page }) => {
  await setup(page)
  await page.goto('/quiz/za-capitals')
  const input = page.locator('input').first()
  await input.click(); await input.press('Enter')
  // a right answer is accepted as soon as it's typed; the 9th ends the quiz
  for (const a of ['Bhisho', 'Bloemfontein', 'Johannesburg', 'Pietermaritzburg', 'Polokwane', 'Nelspruit', 'Mafikeng', 'Kimberley', 'Cape Town']) {
    await input.fill(a)
  }
  await expect(page.getByRole('button', { name: /Joacă din nou/ })).toBeVisible()
  await expect(page.locator('body')).toContainText(/9\s*\/\s*9/)
})

test('the countries page shows the progress map', async ({ page }) => {
  await setup(page)
  await page.goto('/countries')
  await expect(page.locator('.cpm-map')).toBeVisible()
  expect(await page.locator('.cpm-c.has-page').count()).toBeGreaterThanOrEqual(25)
})

test('guests with a few games are offered an account, "Later" hides it', async ({ page }) => {
  await setup(page, { results: finished(5) })
  await page.goto('/')
  await expect(page.locator('.acct-nudge')).toBeVisible()
  await page.locator('.acct-nudge-later').click()
  await expect(page.locator('.acct-nudge')).toHaveCount(0)
  await page.reload()
  await page.waitForTimeout(1500)
  await expect(page.locator('.acct-nudge')).toHaveCount(0)
})

test("Don't Say What I Say: a whole match between two players", async ({ browser, playwright }) => {
  test.setTimeout(150_000)          // every round has a 5-second reveal
  const realtime = createRealtime()
  // each player gets a browser of their own, like two real people: two pages in one headless
  // browser share a single software-GPU process and the second one freezes while starting WebGL
  const second = await playwright.chromium.launch()
  const player = async (name, url, br) => {
    const ctx = await br.newContext()
    const page = await ctx.newPage()
    await setup(page, { realtime })
    await page.addInitScript((n) => localStorage.setItem('duel-name', n), name)
    await page.goto(url)
    return page
  }
  const A = await player('Alex', '/quiz/duel', browser)
  await A.getByRole('button', { name: 'Cameră cu prietenii' }).click()
  const code = (await A.locator('.duel-code').textContent()).trim()
  const B = await player('Maria', `/quiz/duel?room=${code}`, second)
  await expect(A.locator('.duel-players li')).toHaveCount(2, { timeout: 30_000 })
  await A.getByRole('button', { name: 'Începe meciul' }).click()

  const round = async (a, b) => {
    for (const [p, ans] of [[A, a], [B, b]]) {
      const input = p.locator('.duel-input input')
      await expect(input).toBeEnabled()
      await input.fill(ans); await input.press('Enter')
    }
    await expect(A.locator('.duel-answer').first()).toBeVisible()
  }
  await round('Franța', 'Franta')                                 // same answer: both lose a life
  await expect(A.locator('.duel-board')).toContainText('Același răspuns!')
  await round('Narnia', 'Italia')                                 // A: not in the category
  await round('Atlantida', 'Spania')                              // A is out
  await expect(B.locator('.duel-over h2')).toContainText('Ai câștigat')
  await expect(A.locator('.duel-over h2')).toContainText('Maria')
  await second.close()
})
