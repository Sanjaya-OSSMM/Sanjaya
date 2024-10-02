const { scrapeTwitter } = require('./twitterScraper');
const { scrapeTelegram } = require('./telegram/telegramScraper');

async function scrapeContent(platform, keyword, includeMedia, postLimit = 100) {
  const normalizedPlatform = platform.toLowerCase();
  switch (normalizedPlatform) {
    case 'twitter':
      return await scrapeTwitter(keyword);
    case 'telegram':
      return await scrapeTelegram(keyword, postLimit, includeMedia);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

module.exports = { scrapeContent };