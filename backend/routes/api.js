const express = require('express');
const { scrapeContent } = require('../services/scraper');
const { analyzeContent } = require('../services/analyzer');
const { prepareVisualizationData } = require('../services/visualizer');

const router = express.Router();

router.post('/monitor', async (req, res) => {
  try {
    const { platform, keyword } = req.body;    
    const content = await scrapeContent(platform, keyword);
    const analysis = await analyzeContent(content);
    const visualizationData = prepareVisualizationData(analysis);
    
    // Send the response
    res.json({ 
      content: analysis,  // We're sending the analyzed content
      visualizations: visualizationData
    });
  } catch (error) {
    console.error('Error in /monitor endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;