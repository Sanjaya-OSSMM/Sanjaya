import { useState, useEffect, useRef } from 'react';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiMonero, SiRipple } from 'react-icons/si';
import axios from 'axios';

const PRICE_UPDATE_INTERVAL = 30000; // 30 seconds
const STATS_UPDATE_INTERVAL = 120000; // 2 minutes

const coins = ['bitcoin', 'ethereum', 'monero', 'ripple'];

const fetchPriceData = async (coin) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`);
    return response.data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price: price,
    }));
  } catch (error) {
    console.error(`Error fetching price data for ${coin}:`, error);
    return [];
  }
};

const fetchNetworkData = async (coin) => {
  const api = 'https://api.blockchair.com/';
  const endpoints = {
    bitcoin: 'bitcoin/stats',
    ethereum: 'ethereum/stats',
    monero: 'monero/stats',
    ripple: 'ripple/stats',
  };

  try {
    const response = await axios.get(api + endpoints[coin]);
    return { data: response.data.data, source: 'blockchair' };
  } catch (error) {
    console.error(`Error fetching network data for ${coin}:`, error);
    return { data: {}, source: 'error' };
  }
};

const formatNetworkData = (coin, data, source) => {
  if (source === 'error') return {};
  
  const commonData = {
    marketCap: data.market_cap_usd ? (data.market_cap_usd / 1e9).toFixed(2) + ' B USD' : 'N/A',
    change24h: data.market_price_usd_change_24h_percentage ? data.market_price_usd_change_24h_percentage.toFixed(2) + '%' : 'N/A',
  };

  const coinSpecificData = {
    bitcoin: {
      blocks: data.blocks?.toLocaleString() || 'N/A',
      transactions: data.transactions_24h?.toLocaleString() || 'N/A',
      hashrate: data.hashrate_24h ? (data.hashrate_24h / 1e9).toFixed(2) + ' EH/s' : 'N/A',
      blockchainSize: data.blockchain_size ? (data.blockchain_size / 1e9).toFixed(2) + ' GB' : 'N/A',
    },
    ethereum: {
      blocks: data.blocks?.toLocaleString() || 'N/A',
      transactions: data.transactions_24h?.toLocaleString() || 'N/A',
      biggestTransaction: data.largest_transaction_24h?.value_usd 
        ? `${(data.largest_transaction_24h.value_usd / 1e6).toFixed(2)}M USD`
        : 'N/A',
      blockchainSize: data.blockchain_size ? (data.blockchain_size / 1e9).toFixed(2) + ' GB' : 'N/A',
    },
    monero: {
      blocks: data.blocks?.toLocaleString() || 'N/A',
      hashrate: data.hashrate_24h ? (data.hashrate_24h / 1e6).toFixed(2) + ' MH/s' : 'N/A',
      mempoolTx: data.mempool_transactions?.toLocaleString() || 'N/A',
      difficulty: data.difficulty ? (data.difficulty / 1e9).toFixed(2) + ' G' : 'N/A',
    },
    ripple: {
      ledgers: data.ledgers?.toLocaleString() || 'N/A',
      transactions24h: data.transactions_24h?.toLocaleString() || 'N/A',
      transactionsPerSecond: data.transactions_24h ? (data.transactions_24h / 86400).toFixed(2) : 'N/A',
      biggestTransaction: data.largest_transaction_24h?.value_usd 
        ? `${(data.largest_transaction_24h.value_usd / 1e6).toFixed(2)}M USD`
        : 'N/A',
    },
  };

  return {
    ...commonData,
    ...coinSpecificData[coin],
  };
};

export const formatPrice = (price) => {
  if (price === undefined || price === null) return 'N/A';
  return Number(price) >= 1 ? Number(price).toFixed(2) : Number(price).toFixed(6);
};

export const getIcon = (crypto) => {
  switch (crypto) {
    case 'bitcoin':
      return <FaBitcoin className="text-4xl text-orange-500 mr-2" />;
    case 'ethereum':
      return <FaEthereum className="text-4xl text-blue-500 mr-2" />;
    case 'monero':
      return <SiMonero className="text-4xl text-orange-500 mr-2" />;
    case 'ripple':
      return <SiRipple className="text-4xl text-black dark:text-white mr-2" />;
    default:
      return null;
  }
};

export const useDataFetcher = () => {
  const [data, setData] = useState({
    bitcoin: [],
    ethereum: [],
    monero: [],
    ripple: []
  });
  const [cryptoData, setCryptoData] = useState({
    bitcoin: {},
    ethereum: {},
    monero: {},
    ripple: {}
  });

  const fetchPriceDataForCoin = async (coin) => {
    const priceData = await fetchPriceData(coin);
    if (priceData.length > 0) {
      setData(prevData => ({
        ...prevData,
        [coin]: priceData
      }));
      setCryptoData(prevCryptoData => ({
        ...prevCryptoData,
        [coin]: {
          ...prevCryptoData[coin],
          price: priceData[priceData.length - 1].price,
          change: ((priceData[priceData.length - 1].price - priceData[0].price) / priceData[0].price * 100).toFixed(2) + '%'
        }
      }));
    }
  };

  const fetchNetworkDataForCoin = async (coin) => {
    const networkData = await fetchNetworkData(coin);
    const formattedNetworkData = formatNetworkData(coin, networkData.data, networkData.source);
    setCryptoData(prevCryptoData => ({
      ...prevCryptoData,
      [coin]: {
        ...prevCryptoData[coin],
        ...formattedNetworkData
      }
    }));
  };

  useEffect(() => {
    const fetchAllPriceData = async () => {
      await Promise.all(coins.map(coin => fetchPriceDataForCoin(coin)));
    };

    const fetchAllNetworkData = async () => {
      await Promise.all(coins.map(coin => fetchNetworkDataForCoin(coin)));
    };

    fetchAllPriceData();
    fetchAllNetworkData();

    const priceInterval = setInterval(fetchAllPriceData, PRICE_UPDATE_INTERVAL);
    const statsInterval = setInterval(fetchAllNetworkData, STATS_UPDATE_INTERVAL);

    return () => {
      clearInterval(priceInterval);
      clearInterval(statsInterval);
    };
  }, []);

  return { data, cryptoData };
};

export default {
  useDataFetcher,
  formatPrice,
  getIcon
};