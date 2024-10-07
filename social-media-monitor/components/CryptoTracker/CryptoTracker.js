import React, { useState, useEffect } from 'react';
import { FaSearch, FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiTether, SiBinance } from 'react-icons/si';
import { TbCurrencySolana } from 'react-icons/tb';
import axios from 'axios';
import ToggleChart from './ToggleChart';
import Visualizations from './Visualizations';

export default function CryptoTracker() {
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [prices, setPrices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetchLatestBlocks();
      fetchLatestTransactions();
      fetchPrices();
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every minute

    return () => clearInterval(interval);
  }, []);

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
      const response = await axios.get('https://blockchain.info/unconfirmed-transactions?format=json');
      const formattedTransactions = response.data.txs.slice(0, 7).map(tx => ({
        hash: tx.hash,
        time: new Date(tx.time * 1000).toLocaleString(),
        totalBTC: (tx.out.reduce((sum, output) => sum + output.value, 0) / 1e8).toFixed(8),
      }));
      setLatestTransactions(formattedTransactions);
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
        // First, try to search for an address
        const addressResponse = await axios.get(`https://blockchain.info/rawaddr/${searchQuery}`);
        setSearchResults(addressResponse.data);
      } catch (error) {
        try {
          // If not an address, try to search for a transaction
          const txResponse = await axios.get(`https://blockchain.info/rawtx/${searchQuery}`);
          setSearchResults(txResponse.data);
        } catch (error) {
          console.error('Error searching:', error);
          setSearchResults(null);
        }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <ToggleChart />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-auto">
            <Visualizations.MarketCapHeatmap />
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
                <p className="text-sm text-gray-600 dark:text-gray-300">{tx.totalBTC} BTC</p>
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
                  {price.symbol === 'btc' && <FaBitcoin className="text-orange-500 mr-2" />}
                  {price.symbol === 'eth' && <FaEthereum className="text-blue-500 mr-2" />}
                  {price.symbol === 'usdt' && <SiTether className="text-green-500 mr-2" />}
                  {price.symbol === 'bnb' && <SiBinance className="text-yellow-500 mr-2" />}
                  {price.symbol === 'sol' && <TbCurrencySolana className="text-purple-500 mr-2" />}
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
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-auto">
            <Visualizations.HashrateDistribution />
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
        <p><strong>Block Height:</strong> {results.block_height || 'Unconfirmed'}</p>
        <p><strong>Total Amount:</strong> {(results.out.reduce((sum, output) => sum + output.value, 0) / 1e8).toFixed(8)} BTC</p>
        <p><strong>Fees:</strong> {(results.fee / 1e8).toFixed(8)} BTC</p>
      </div>
    ) : (
      <p>No detailed information available for this search query.</p>
    )}
  </div>
);