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
    const fetchData = () => {
      fetchBitcoinData();
      fetchLatestBlocks();
      fetchLatestTransactions();
      fetchPrices();
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every minute

    return () => clearInterval(interval);
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
        blocks: data.block_time_in_minutes,
        hashrate: (data.market_data.total_volume.btc / 1e9).toFixed(2) + ' EH/s',
        blockchainSize: (data.market_data.circulating_supply / 1e9).toFixed(2) + ' GB',
        uniqueAddresses: Math.floor(Math.random() * 1000000), // Placeholder, replace with actual data
      });
    } catch (error) {
      console.error('Error fetching Bitcoin data:', error);
    }
  };

  const fetchLatestBlocks = async () => {
    try {
      const response = await axios.get('https://api.blockchair.com/bitcoin/blocks?format=json');
      setLatestBlocks(response.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching latest blocks:', error);
    }
  };

  const fetchLatestTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crypto/transactions');
      setLatestTransactions(response.data.slice(0, 5));
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center">
            <FaBitcoin className="text-4xl text-orange-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Crypto Tracker</h1>
          </div>
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search transactions and addresses"
                className="w-full px-4 py-3 pr-12 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-gray-300 hover:text-blue-500 focus:outline-none transition duration-150 ease-in-out"
            >
              <span className="sr-only">Search</span>
              <FaSearch className="h-5 w-5" />
            </button>
          </form>
        </div>

        {searchResults && <SearchResults results={searchResults} />}

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaBitcoin className="text-4xl text-orange-500 mr-2" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bitcoin (BTC)</h2>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">${bitcoinData.price.toLocaleString()} <span className={`text-${bitcoinData.change.startsWith('-') ? 'red' : 'green'}-500 text-xl`}>{bitcoinData.change}</span></p>
              </div>
            </div>
            <Visualizations.BitcoinPriceChart />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Latest Blocks</h3>
            {latestBlocks.map((block) => (
              <div key={block.hash} className="mb-4 last:mb-0">
                <p className="text-lg font-semibold text-blue-500">{block.id}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(block.time).toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{block.transaction_count} Txs • {(block.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Latest Transactions</h3>
            {latestTransactions.map((tx) => (
              <div key={tx.hash} className="mb-4 last:mb-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">{tx.time}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{tx.amount.toFixed(8)} BTC • ${tx.value.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
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

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Visualizations.MarketCapHeatmap />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Visualizations.BitcoinDominance />
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
        <p><strong>Total Amount:</strong> {results.total} BTC</p>
        <p><strong>Fees:</strong> {results.fees} BTC</p>
      </div>
    ) : (
      <p>No detailed information available for this search query.</p>
    )}
  </div>
);