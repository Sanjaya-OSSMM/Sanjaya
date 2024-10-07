import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { HiMiniChevronDown } from "react-icons/hi2";
import { useDataFetcher, formatPrice, getIcon } from './CryptoUtils';

const ToggleChart = () => {
  const [activeChart, setActiveChart] = useState('bitcoin');
  const { data, cryptoData } = useDataFetcher();

  const renderNetworkStats = () => {
    const stats = cryptoData[activeChart];
    if (!stats) return null;
  
    const commonStats = [
      { label: 'Market Cap', value: stats.marketCap },
      { label: '24h Change', value: `${stats.change}` },
    ];
  
    let specificStats = [];
     
    if (activeChart === 'ethereum') {
      specificStats = [
        { label: 'Transactions (24h)', value: stats.transactions },
        { label: 'Blocks', value: stats.blocks },
        { label: 'Biggest Transaction (24h)', value: stats.biggestTransaction },
        { label: 'Blockchain Size', value: stats.blockchainSize },
      ];
    } else if (activeChart === 'monero') {
      specificStats = [
        { label: 'Blocks', value: stats.blocks },
        { label: 'Network Hashrate', value: stats.hashrate },
        { label: 'Mempool Transactions', value: stats.mempoolTx },
        { label: 'Difficulty', value: stats.difficulty },
      ];
    } else if (activeChart === 'ripple') {
      specificStats = [
        { label: 'Ledgers', value: stats.ledgers },
        { label: 'Transactions (24h)', value: stats.transactions24h },
        { label: 'Transactions per Second', value: stats.transactionsPerSecond },
        { label: 'Biggest Transaction (24h)', value: stats.biggestTransaction },
      ];
    } else { // bitcoin
      specificStats = [
        { label: 'Transactions (24h)', value: stats.transactions },
        { label: 'Blocks', value: stats.blocks },
        { label: 'Network Hashrate', value: stats.hashrate },
        { label: 'Blockchain Size', value: stats.blockchainSize },
      ];
    }
  
    return [...commonStats, ...specificStats].map(({ label, value }) => (
      <div key={label} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">{value}</p>
      </div>
    ));
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {activeChart.charAt(0).toUpperCase() + activeChart.slice(1)} Data
        </h2>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-800 dark:text-white"
            value={activeChart}
            onChange={(e) => setActiveChart(e.target.value)}
          >
            {Object.keys(data).map(coin => (
              <option key={coin} value={coin}>{coin.charAt(0).toUpperCase() + coin.slice(1)}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <HiMiniChevronDown className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="flex items-center mb-4">
        {getIcon(activeChart)}
        <div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            ${formatPrice(cryptoData[activeChart]?.price)} 
            {cryptoData[activeChart]?.change && (
            <span className={`text-${cryptoData[activeChart].change.startsWith('-') ? 'red' : 'green'}-500 text-xl ml-2`}>
              {cryptoData[activeChart].change}
            </span>
            )}
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data[activeChart] || []}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.375rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
            itemStyle={{ color: '#E5E7EB' }}
            formatter={(value) => ['$' + formatPrice(value), 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={
              activeChart === 'bitcoin' ? '#F7931A' :
              activeChart === 'ethereum' ? '#3C3C3D' :
              activeChart === 'monero' ? '#F60' :
              '#0080FF'
            }
            fill={`url(#color${activeChart.charAt(0).toUpperCase() + activeChart.slice(1)}Price)`}
          />
          <defs>
            {Object.keys(data).map(coin => (
              <linearGradient key={coin} id={`color${coin.charAt(0).toUpperCase() + coin.slice(1)}Price`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={
                  coin === 'bitcoin' ? '#F7931A' :
                  coin === 'ethereum' ? '#3C3C3D' :
                  coin === 'monero' ? '#F60' :
                  '#0080FF'
                } stopOpacity={0.8}/>
                <stop offset="95%" stopColor={
                  coin === 'bitcoin' ? '#F7931A' :
                  coin === 'ethereum' ? '#3C3C3D' :
                  coin === 'monero' ? '#F60' :
                  '#0080FF'
                } stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
        </AreaChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {renderNetworkStats()}
      </div>
    </div>
  );
};

export default ToggleChart;