import React, { useState, useEffect } from 'react';
import { FaSearch, FaBitcoin, FaEthereum } from 'react-icons/fa';
import axios from 'axios';
import Visualizations from './Visualizations';

export default function CryptoTracker() {
  const [bitcoinData, setBitcoinData] = useState({
    price: 0,
    change: '0%',
    transactions: 0,
    sentToday: 0,
    blocks: 0,
    hashrate: '0 EH/s',
    blockchainSize: '0 GB',
    uniqueAddresses: 0,
  });
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [prices, setPrices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    fetchBitcoinData();
    fetchLatestBlocks();
    fetchLatestTransactions();
    fetchPrices();
  }, []);

  const fetchBitcoinData = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin');
      const data = response.data;
      setBitcoinData({
        price: data.market_data.current_price.usd,
        change: data.market_data.price_change_percentage_24h.toFixed(2) + '%',
        transactions: data.market_data.total_volume.usd,
        sentToday: data.market_data.total_volume.usd,
        blocks: 0,
        hashrate: data.market_data.total_volume.btc.toFixed(2) + ' BTC',
        blockchainSize: '0 GB',
        uniqueAddresses: 0,
      });
    } catch (error) {
      console.error('Error fetching Bitcoin data:', error);
    }
  };

  const fetchLatestBlocks = async () => {
    try {
      const response = await axios.get('https://api.blockchair.com/bitcoin/blocks?limit=5');
      setLatestBlocks(response.data.data);
    } catch (error) {
      console.error('Error fetching latest blocks:', error);
    }
  };

  const fetchLatestTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crypto/transactions');
      setLatestTransactions(response.data);
    } catch (error) {
      console.error('Error fetching latest transactions:', error);
    }
  };

  const fetchPrices = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false');
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery) {
      try {
        const response = await axios.get(`http://localhost:5000/api/crypto/search/${searchQuery}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching:', error);
        setSearchResults(null);
      }
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <FaBitcoin className="text-4xl text-orange-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Crypto Tracker</h1>
          </div>
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search address or transaction..."
                className="w-64 px-4 py-2 rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-3 text-gray-400">
                <FaSearch />
              </button>
            </div>
          </form>
        </div>

        {searchResults && <SearchResults results={searchResults} />}

        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaBitcoin className="text-4xl text-orange-500 mr-2" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bitcoin (BTC)</h2>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">${bitcoinData.price.toLocaleString()} <span className="text-green-500 text-xl">{bitcoinData.change}</span></p>
              </div>
            </div>
            <Visualizations.BitcoinPriceChart />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Latest Blocks</h3>
            {latestBlocks.map((block) => (
              <div key={block.id} className="mb-4 last:mb-0">
                <p className="text-lg font-semibold text-blue-500">{block.id}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(block.time).toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{block.transaction_count} Txs • {(block.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Latest Transactions</h3>
            {latestTransactions.map((tx) => (
              <div key={tx.hash} className="mb-4 last:mb-0">
                <p className="text-lg font-semibold text-blue-500">{tx.hash.substring(0, 10)}...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tx.time}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{tx.amount.toFixed(8)} BTC • ${tx.value.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top Cryptocurrencies</h3>
            {prices.map((price) => (
              <div key={price.id} className="flex justify-between items-center mb-4 last:mb-0">
                <div className="flex items-center">
                  {price.symbol === 'btc' ? <FaBitcoin className="text-orange-500 mr-2" /> : <FaEthereum className="text-blue-500 mr-2" />}
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{price.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{price.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white">${price.current_price.toLocaleString()}</p>
                  <p className={`text-sm ${price.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {price.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Visualizations.HashrateDistribution />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Visualizations.MarketCapHeatmap />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Bitcoin Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Transactions</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{bitcoinData.transactions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sent Today</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">${bitcoinData.sentToday.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Blocks</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{bitcoinData.blocks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Network Hashrate</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{bitcoinData.hashrate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Blockchain Size</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{bitcoinData.blockchainSize}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Unique Addresses (24h)</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{bitcoinData.uniqueAddresses.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SearchResults = ({ results }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
    <h2 className="text-2xl font-bold mb-4">Search Results</h2>
    {results.address ? (
      <div>
        <h3 className="text-xl font-bold mb-2">Address Details</h3>
        <p><strong>Address:</strong> {results.address}</p>
        <p><strong>Balance:</strong> {results.balance} BTC</p>
        <p><strong>Total Received:</strong> {results.total_received} BTC</p>
        <p><strong>Total Sent:</strong> {results.total_sent} BTC</p>
        <p><strong>Transaction Count:</strong> {results.n_tx}</p>
      </div>
    ) : results.hash ? (
      <div>
        <h3 className="text-xl font-bold mb-2">Transaction Details</h3>
        <p><strong>Transaction Hash:</strong> {results.hash}</p>
        <p><strong>Block Height:</strong> {results.block_height}</p>
        <p><strong>Confirmations:</strong> {results.confirmations}</p>
        <p><strong>Total Input:</strong> {results.total} BTC</p>
        <p><strong>Total Output:</strong> {results.total} BTC</p>
        <p><strong>Fees:</strong> {results.fees} BTC</p>
      </div>
    ) : (
      <p>No detailed information available for this search query.</p>
    )}
  </div>
);