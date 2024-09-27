const { scrapeTwitter } = require('./twitterScraper');
const { scrapeInstagram } = require('./instagramScraper');
const { scrapeTelegram } = require('./telegramScraper');

async function scrapeContent(platform, keyword, isLoggedIn) {
  switch (platform) {
    case 'twitter':
      return await scrapeTwitter(keyword, isLoggedIn);
    case 'instagram':
      return await scrapeInstagram(keyword, isLoggedIn);
    case 'telegram':
      return await scrapeTelegram(keyword);
    default:
      throw new Error('Unsupported platform');
  }
}

module.exports = { scrapeContent };