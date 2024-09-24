const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const USER_DATA_DIR = path.join(__dirname, '..', 'browser_data');
const SESSION_FILE = path.join(USER_DATA_DIR, 'session.json');

async function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    await fs.promises.mkdir(directory, { recursive: true });
  }
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
}

async function scrapeContent(platform, keyword) {
  await ensureDirectoryExists(USER_DATA_DIR);

  let context;
  let isNewSession = false;

  const launchOptions = {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  };

  if (fs.existsSync(SESSION_FILE)) {
    try {
      context = await chromium.launchPersistentContext(USER_DATA_DIR, launchOptions);
    } catch (error) {
      console.error('Error loading existing session:', error);
      isNewSession = true;
    }
  } else {
    isNewSession = true;
  }

  if (isNewSession) {
    context = await chromium.launchPersistentContext(USER_DATA_DIR, launchOptions);
    console.log('New session created. Please sign in manually.');
    await askQuestion('Press Enter after you have signed in...');
    await context.storageState({ path: SESSION_FILE });
  }

  const page = await context.newPage();
  let content = [];

  try {
    if (platform === 'twitter') {
      await page.goto(`https://twitter.com/search?q=${encodeURIComponent(keyword)}&src=typed_query`);
      await page.waitForSelector('article', { timeout: 30000 });
      content = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('article')).map(tweet => ({
          text: tweet.querySelector('[lang]')?.innerText || 'No text found',
          author: tweet.querySelector('[data-testid="User-Name"]')?.innerText.split('\n')[0] || 'Unknown author',
          platform: 'twitter'
        }));
      });
    } else if (platform === 'instagram') {
      await page.goto(`https://www.instagram.com/explore/tags/${encodeURIComponent(keyword)}/`);
      await page.waitForSelector('article', { timeout: 30000 });
      content = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('article')).map(post => ({
          text: post.querySelector('div._a9zs')?.innerText || 'No text found',
          author: post.querySelector('div._a9zc')?.innerText || 'Unknown author',
          platform: 'instagram'
        }));
      });
    }
  } catch (error) {
    console.error(`Error scraping ${platform}: ${error.message}`);
  } finally {
    await context.close();
  }

  return content;
}

module.exports = { scrapeContent };