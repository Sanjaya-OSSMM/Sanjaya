const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const USER_DATA_DIR = path.join(__dirname, '..', 'browser_data');

async function scrapeTwitter(keyword, isLoggedIn) {
  const launchOptions = {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  };
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, launchOptions);
  const page = await context.newPage();

  let content = [];

  try {
    await page.goto(`https://twitter.com/search?q=${encodeURIComponent(keyword)}&src=typed_query`);

    if (!isLoggedIn) {
      // Wait for user to log in
      await page.waitForSelector('article', { timeout: 60000 });
    }

    await page.waitForSelector('article', { timeout: 30000 });
    content = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('article')).map((tweet) => ({
        text: tweet.querySelector('[lang]')?.innerText || 'No text found',
        author: tweet.querySelector('[data-testid="User-Name"]')?.innerText.split('\n')[0] || 'Unknown author',
        platform: 'twitter',
      }));
    });
  } catch (error) {
    console.error(`Error scraping Twitter: ${error.message}`);
  } finally {
    await context.close();
  }

  return content;
}

module.exports = { scrapeTwitter };