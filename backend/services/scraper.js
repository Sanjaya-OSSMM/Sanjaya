const { scrapeTwitter } = require('./twitterScraper');
const { scrapeTelegram } = require('./telegramScraper');

async function scrapeContent(platform, keyword, isLoggedIn = false) {
  // Convert platform to lowercase for case-insensitive comparison
  const normalizedPlatform = platform.toLowerCase();

  switch (normalizedPlatform) {
    case 'twitter':
      return await scrapeTwitter(keyword, isLoggedIn);
    case 'telegram':
      return await scrapeTelegram(keyword);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

module.exports = { scrapeContent };