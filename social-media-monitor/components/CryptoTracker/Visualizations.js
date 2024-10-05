import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Treemap } from 'recharts';
import axios from 'axios';

const BitcoinPriceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crypto/candlestick');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching Bitcoin price data:', error);
      }
    };
    fetchData();
  }, []);

  return (
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
        <Line type="monotone" dataKey="close" stroke="#3B82F6" strokeWidth={2} dot={false} />
      </LineChart>
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
        const response = await axios.get('http://localhost:5000/api/crypto/marketcap');
        const formattedData = response.data.map(coin => ({
          name: coin.symbol.toUpperCase(),
          size: coin.market_cap,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching market cap data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Market Cap Heatmap</h3>
      <ResponsiveContainer width="100%" height={200}>
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
              <text
                x={x + width / 2}
                y={y + height / 2 + 7}
                textAnchor="middle"
                fill="#fff"
                fontSize={14}
              >
                {name}
              </text>
            </g>
          )}
        />
      </ResponsiveContainer>
    </div>
  );
};

export default {
  BitcoinPriceChart,
  HashrateDistribution,
  MarketCapHeatmap,
};