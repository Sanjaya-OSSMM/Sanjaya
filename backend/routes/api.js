const express = require('express');
const { scrapeContent } = require('../services/scraper');
const { analyzeContent } = require('../services/analyzer');
const { prepareVisualizationData } = require('../services/visualizer');
const { translate } = require('@vitalets/google-translate-api');
const axios = require('axios');

const router = express.Router();

// Existing routes
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

// Crypto Tracker routes
router.get('/crypto/transactions', async (req, res) => {
  try {
    const response = await axios.get('https://blockchain.info/unconfirmed-transactions?format=json');
    const transactions = response.data.txs.slice(0, 10).map(tx => ({
      hash: tx.hash,
      time: new Date(tx.time * 1000).toLocaleTimeString(),
      amount: tx.out.reduce((sum, output) => sum + output.value, 0) / 1e8,
      value: (tx.out.reduce((sum, output) => sum + output.value, 0) / 1e8) * 60000, // Assuming 1 BTC = $60,000 USD
    }));
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching live transactions:', error);
    res.status(500).json({ error: 'Failed to fetch live transactions' });
  }
});

router.get('/crypto/hashrate', async (req, res) => {
  try {
    const response = await axios.get('https://api.blockchain.info/pools?timespan=5days');
    const hashrateData = Object.entries(response.data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
    
    const otherValue = Object.values(response.data)
      .reduce((sum, value) => sum + value, 0) - hashrateData.reduce((sum, item) => sum + item.value, 0);
    
    hashrateData.push({ name: 'Others', value: otherValue });
    
    res.json(hashrateData);
  } catch (error) {
    console.error('Error fetching hashrate distribution data:', error);
    res.status(500).json({ error: 'Failed to fetch hashrate distribution data' });
  }
});

router.get('/crypto/search/:query', async (req, res) => {
  const { query } = req.params;
  try {
    // Check if the query is a Bitcoin address
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(query)) {
      const response = await axios.get(`https://blockchain.info/rawaddr/${query}`);
      res.json({
        address: response.data.address,
        balance: response.data.final_balance / 1e8,
        total_received: response.data.total_received / 1e8,
        total_sent: response.data.total_sent / 1e8,
        n_tx: response.data.n_tx,
      });
    } 
    // Check if the query is a transaction hash
    else if (/^[a-fA-F0-9]{64}$/.test(query)) {
      const response = await axios.get(`https://blockchain.info/rawtx/${query}`);
      res.json({
        hash: response.data.hash,
        block_height: response.data.block_height,
        confirmations: response.data.confirmations,
        total: response.data.out.reduce((sum, output) => sum + output.value, 0) / 1e8,
        fees: response.data.fee / 1e8,
      });
    } 
    else {
      res.status(400).json({ error: 'Invalid search query' });
    }
  } catch (error) {
    console.error('Error searching for address or transaction:', error);
    res.status(500).json({ error: 'Failed to search for address or transaction' });
  }
});

module.exports = router;