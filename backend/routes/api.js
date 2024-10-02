const express = require('express');
const { scrapeContent } = require('../services/scraper');
const { analyzeContent } = require('../services/analyzer');
const { prepareVisualizationData } = require('../services/visualizer');

const router = express.Router();

router.post('/monitor', async (req, res) => {
  try {
    const { platform, keyword, postLimit, includeMedia } = req.body;

    if (!platform || !keyword) {
      return res.status(400).json({ error: 'Platform and keyword are required' });
    }

    const content = await scrapeContent(platform, keyword, includeMedia, postLimit);
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

module.exports = router;