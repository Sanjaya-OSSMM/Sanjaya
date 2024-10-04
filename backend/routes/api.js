const express = require('express');
const { scrapeContent } = require('../services/scraper');
const { analyzeContent } = require('../services/analyzer');
const { prepareVisualizationData } = require('../services/visualizer');
const { translate } = require('@vitalets/google-translate-api');

const router = express.Router();

router.post('/monitor', async (req, res) => {
  try {
    const { platform, keyword, postLimit, username, userId, groupName, groupUsername, operators, includeMedia } = req.body;

    if (!platform || !keyword) {
      return res.status(400).json({ error: 'Platform and keyword are required' });
    }

    const filterOptions = { username, userId, groupName, groupUsername, operators };

    const content = await scrapeContent(platform, keyword, includeMedia, postLimit, filterOptions);
    const analysis = await analyzeContent(content);
    const visualizationData = prepareVisualizationData(analysis);

    res.json({
      content: analysis,
      visualizations: visualizationData,
    });
  } catch (error) {
    console.error('Error in /monitor endpoint:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

// Updated translation endpoint
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    const result = await translate(text, { to: targetLanguage });

    res.json({
      originalText: text,
      translatedText: result.text,
      targetLanguage,
    });
  } catch (error) {
    console.error('Error in /translate endpoint:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred during translation' });
  }
});

module.exports = router;