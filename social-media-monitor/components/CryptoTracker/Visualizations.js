import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Treemap } from 'recharts';
import axios from 'axios';

const HashrateDistribution = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.blockchain.info/pools?timespan=5days');
        const formattedData = Object.entries(response.data).map(([name, value]) => ({ name, value }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching hashrate distribution data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3600000); // Update hourly
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

const [marketStats, setMarketStats] = useState({
    totalMarketCap: 0,
    volume24h: 0,
  });

  useEffect(() => {
    const fetchMarketStats = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/global');
        const { data } = response.data;
        setMarketStats({
          totalMarketCap: data.total_market_cap.usd,
          volume24h: data.total_volume.usd,
        });
      } catch (error) {
        console.error('Error fetching market stats:', error);
      }
    };
    fetchMarketStats();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Market Cap Heatmap</h3>
      <div className="flex-grow">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={1}
          stroke="#fff"
          fill="#8884d8"
          content={({ depth, x, y, width, height, index, name }) => (
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
                  y={y + height / 2}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={14}
                  dy=".3em"
                >
                  {name}
                </text>
              )}
            </g>
          )}
        />
      </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Market Cap</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            ${(marketStats.totalMarketCap / 1e9).toFixed(2)}B
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">24h Volume</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            ${(marketStats.volume24h / 1e9).toFixed(2)}B
          </p>
        </div>
      </div>
    </div>
  );
};

export default {
  HashrateDistribution,
  MarketCapHeatmap,
};