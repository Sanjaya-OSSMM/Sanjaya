const { scrapeTwitter } = require('./twitterScraper');
const { scrapeTelegram } = require('./telegramScraper');

async function scrapeContent(platform, keyword, isLoggedIn = false, postLimit = 100) {
  const normalizedPlatform = platform.toLowerCase();
  switch (normalizedPlatform) {
    case 'twitter':
      return await scrapeTwitter(keyword, isLoggedIn);
    case 'telegram':
      return await scrapeTelegram(keyword, postLimit);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

module.exports = { scrapeContent };