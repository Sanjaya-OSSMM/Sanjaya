import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, PieChart, Pie, Cell, Treemap } from 'recharts';
import axios from 'axios';

const BitcoinPriceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7');
        const formattedData = response.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price,
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching Bitcoin price data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
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
        />
        <Area type="monotone" dataKey="price" stroke="#3B82F6" fill="url(#colorPrice)" />
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
};

const HashrateDistribution = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crypto/hashrate');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching hashrate distribution data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update hourly
    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Hashrate Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.375rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
            itemStyle={{ color: '#E5E7EB' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const MarketCapHeatmap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        const formattedData = response.data.map(coin => ({
          name: coin.symbol.toUpperCase(),
          size: coin.market_cap,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching market cap data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Market Cap Heatmap</h3>
      <ResponsiveContainer width="100%" height={300}>
        <Treemap
          data={data}
          dataKey="size"
          ratio={4/3}
          stroke="#fff"
          content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => (
            <g>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                  fill: data[index]?.color,
                  stroke: '#fff',
                  strokeWidth: 2 / (depth + 1e-10),
                  strokeOpacity: 1 / (depth + 1e-10),
                }}
              />
              {width > 30 && height > 30 && (
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 7}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={14}
                >
                  {name}
                </text>
              )}
            </g>
          )}
        />
      </ResponsiveContainer>
    </div>
  );
};

const BitcoinDominance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/global');
        const btcDominance = response.data.data.market_cap_percentage.btc;
        const historicalData = []; // You'd need to fetch historical data from an appropriate API
        for (let i = 30; i >= 0; i--) {
          historicalData.push({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
            dominance: btcDominance + Math.random() * 5 - 2.5, // This is just random data for illustration
          });
        }
        setData(historicalData);
      } catch (error) {
        console.error('Error fetching Bitcoin dominance data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update hourly
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Bitcoin Dominance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
          />
          <Line type="monotone" dataKey="dominance" stroke="#F59E0B" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  BitcoinPriceChart,
  HashrateDistribution,
  MarketCapHeatmap,
  BitcoinDominance,
};