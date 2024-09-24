const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const USER_DATA_DIR = path.join(__dirname, '..', 'browser_data');

async function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    await fs.promises.mkdir(directory, { recursive: true });
  }
}

async function scrapeContent(platform, keyword, isLoggedIn) {
  await ensureDirectoryExists(USER_DATA_DIR);

  const launchOptions = {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  };

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, launchOptions);
  const page = await context.newPage();

  let content = [];

  try {
    if (platform === 'twitter') {
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
    } else if (platform === 'instagram') {
      await page.goto(`https://www.instagram.com/explore/tags/${encodeURIComponent(keyword)}/`);

      if (!isLoggedIn) {
        // Wait for user to log in
        await page.waitForSelector('article', { timeout: 60000 });
      }

      await page.waitForSelector('article');

      // Automated scrolling
      let lastHeight = await page.evaluate('document.body.scrollHeight');
      while (true) {
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForTimeout(2000);
        const newHeight = await page.evaluate('document.body.scrollHeight');
        if (newHeight === lastHeight) {
          break;
        }
        lastHeight = newHeight;
      }

      // Scrape post data
      content = await page.$$eval('article', (articles) =>
        articles.map((article) => ({
          text: article.querySelector('div.C4VMK > span')?.innerText || 'No text found',
          author: article.querySelector('a[title]')?.innerText || 'Unknown author',
          username: article.querySelector('a[title]')?.getAttribute('href')?.replace('/', '') || 'Unknown username',
          platform: 'instagram',
        }))
      );
    }
  } catch (error) {
    console.error(`Error scraping ${platform}: ${error.message}`);
  } finally {
    await context.close(); // Ensure browser closes properly
  }

  return content;
}

module.exports = { scrapeContent };