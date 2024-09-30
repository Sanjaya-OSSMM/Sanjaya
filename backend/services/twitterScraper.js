const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const USER_DATA_DIR = path.join(__dirname, '..', 'browser_data');
const MAX_TWEETS = 100; // Adjust this value to control how many tweets to scrape
const SCROLL_DELAY = 1000; // Delay between scrolls in milliseconds

async function scrapeTwitter(keyword, isLoggedIn) {
  const launchOptions = {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  };

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, launchOptions);
  const page = await context.newPage();
  let content = [];

  try {
    await page.goto(`https://twitter.com/search?q=${encodeURIComponent(keyword)}&src=typed_query&f=live`);

    if (!isLoggedIn) {
      console.log('Waiting for user to log in...');
      await page.waitForSelector('article', { timeout: 60000 });
    }

    await page.waitForSelector('article', { timeout: 30000 });

    let previousHeight;
    while (content.length < MAX_TWEETS) {
      content = await page.evaluate(scrapeTwitterPosts);

      if (content.length >= MAX_TWEETS) break;

      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForTimeout(SCROLL_DELAY);

      const currentHeight = await page.evaluate('document.body.scrollHeight');
      if (currentHeight === previousHeight) {
        console.log('Reached end of page or no more new tweets');
        break;
      }
    }

    content = content.slice(0, MAX_TWEETS); // Ensure we don't exceed MAX_TWEETS

  } catch (error) {
    console.error(`Error scraping Twitter: ${error.message}`);
  } finally {
    await context.close();
  }

  return content;
}

function scrapeTwitterPosts() {
  return Array.from(document.querySelectorAll('article')).map((tweet) => {
    const tweetText = tweet.querySelector('[lang]')?.innerText || 'No text found';
    const authorElement = tweet.querySelector('[data-testid="User-Name"]');
    const author = authorElement ? authorElement.innerText.split('\n')[0] : 'Unknown author';
    const timestampElement = tweet.querySelector('time');
    const timestamp = timestampElement ? timestampElement.getAttribute('datetime') : '';
    const likesElement = tweet.querySelector('[data-testid="like"]');
    const likes = likesElement ? likesElement.textContent : '0';
    const retweetsElement = tweet.querySelector('[data-testid="retweet"]');
    const retweets = retweetsElement ? retweetsElement.textContent : '0';

    return {
      text: tweetText,
      author: author,
      platform: 'twitter',
      timestamp: timestamp,
      likes: likes,
      retweets: retweets
    };
  });
}

module.exports = { scrapeTwitter };