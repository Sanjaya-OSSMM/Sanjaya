const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const USER_DATA_DIR = path.join(__dirname, '..', 'browser_data');

async function scrapeInstagram(keyword, isLoggedIn) {
  const launchOptions = {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  };
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, launchOptions);
  const page = await context.newPage();

  let content = [];

  try {
    await page.goto(`https://www.instagram.com/explore/tags/${encodeURIComponent(keyword)}/`);

    if (!isLoggedIn) {
      await page.waitForSelector('article', { timeout: 60000 });
    }

    await page.waitForSelector('article');

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

    content = await page.$$eval('article', (articles) =>
      articles.map((article) => ({
        text: article.querySelector('div.C4VMK > span')?.innerText || 'No text found',
        author: article.querySelector('a[title]')?.innerText || 'Unknown author',
        username: article.querySelector('a[title]')?.getAttribute('href')?.replace('/', '') || 'Unknown username',
        platform: 'instagram',
      }))
    );
  } catch (error) {
    console.error(`Error scraping Instagram: ${error.message}`);
  } finally {
    await context.close();
  }

  return content;
}

module.exports = { scrapeInstagram };