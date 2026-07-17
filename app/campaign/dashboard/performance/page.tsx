'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  BanknotesIcon,
  PlusCircleIcon,
  DocumentChartBarIcon,
  WalletIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

// Generate actual dates for the last 30 days
const generateDates = () => {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  return dates;
};

// Sample data with real dates and ROAS values
const performanceData = generateDates().map((date) => {
  const spend = Math.floor(Math.random() * 500) + 100;
  const revenue = Math.floor(Math.random() * 1200) + 200;
  const roas = (revenue / spend) * 100;
  
  return {
    date: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
    spend,
    revenue,
    roas: Math.max(50, Math.min(300, roas)), // Keep ROAS between 50% and 300% for realistic values
    impressions: Math.floor(Math.random() * 10000) + 1000,
    clicks: Math.floor(Math.random() * 500) + 50,
    conversions: Math.floor(Math.random() * 50) + 5,
  };
});

const campaignPerformance = [
  {
    name: 'Summer Sale',
    spend: 1200,
    revenue: 2400,
    roas: 200,
    impressions: 15000,
    clicks: 750,
    conversions: 125,
  },
  {
    name: 'Product Launch',
    spend: 800,
    revenue: 1400,
    roas: 175,
    impressions: 12000,
    clicks: 600,
    conversions: 80,
  },
  {
    name: 'Holiday Special',
    spend: 1500,
    revenue: 3300,
    roas: 220,
    impressions: 20000,
    clicks: 1000,
    conversions: 150,
  },
];

interface MetricConfig {
  label: string;
  color: string;
  prefix: string;
  suffix: string;
  description?: string;
}

interface Metrics {
  roas: MetricConfig;
  cpa: MetricConfig;
  conversionRate: MetricConfig;
  impressions: MetricConfig;
  clicks: MetricConfig;
  activeCampaigns: MetricConfig;
}

export default function PerformancePage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState<keyof Metrics>('roas');
  const [showRoasTooltip, setShowRoasTooltip] = useState(false);

  const metrics: Metrics = {
    roas: { 
      label: 'ROAS %', 
      color: '#10B981', 
      prefix: '', 
      suffix: '%',
      description: 'Return on Ad Spend - Revenue generated per dollar spent on advertising'
    },
    cpa: { label: 'Cost per Acquisition', color: '#4F46E5', prefix: '$', suffix: '' },
    conversionRate: { label: 'Conversion Rate', color: '#06B6D4', prefix: '', suffix: '%' },
    impressions: { label: 'Impressions', color: '#8B5CF6', prefix: '', suffix: '' },
    clicks: { label: 'Clicks', color: '#EC4899', prefix: '', suffix: '' },
    activeCampaigns: { label: 'Active Campaigns', color: '#F59E0B', prefix: '', suffix: '' },
  };

  const calculateMetrics = () => {
    const latest = performanceData[performanceData.length - 1];
    const previous = performanceData[performanceData.length - 2];
    return {
      roas: {
        value: latest.roas.toFixed(1),
        change: ((latest.roas - previous.roas) / previous.roas) * 100,
      },
      cpa: {
        value: (latest.spend / latest.conversions).toFixed(2),
        change: (((previous.spend / previous.conversions) - (latest.spend / latest.conversions)) / (previous.spend / previous.conversions)) * 100,
      },
      conversionRate: {
        value: ((latest.conversions / latest.clicks) * 100).toFixed(1),
        change: ((latest.conversions / latest.clicks - previous.conversions / previous.clicks) / (previous.conversions / previous.clicks)) * 100,
      },
      impressions: {
        value: latest.impressions,
        change: ((latest.impressions - previous.impressions) / previous.impressions) * 100,
      },
      clicks: {
        value: latest.clicks,
        change: ((latest.clicks - previous.clicks) / previous.clicks) * 100,
      },
      activeCampaigns: {
        value: 3,
        change: 50,
      },
    };
  };

  const currentMetrics = calculateMetrics();

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-semibold text-gray-900">
                {currentMetrics.activeCampaigns.value}
              </p>
            </div>
            <div className={`flex items-center ${
              currentMetrics.activeCampaigns.change >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {currentMetrics.activeCampaigns.change >= 0 ? (
                <ArrowTrendingUpIcon className="h-5 w-5" />
              ) : (
                <ArrowTrendingDownIcon className="h-5 w-5" />
              )}
              <span className="text-sm ml-1">
                {Math.abs(currentMetrics.activeCampaigns.change).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-4">
            <MegaphoneIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost per Acquisition</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${currentMetrics.cpa.value}
              </p>
            </div>
            <div className={`flex items-center ${
              currentMetrics.cpa.change >= 0 ? 'text-red-600' : 'text-emerald-600'
            }`}>
              {currentMetrics.cpa.change >= 0 ? (
                <ArrowTrendingUpIcon className="h-5 w-5" />
              ) : (
                <ArrowTrendingDownIcon className="h-5 w-5" />
              )}
              <span className="text-sm ml-1">
                {Math.abs(currentMetrics.cpa.change).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-4">
            <BanknotesIcon className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {currentMetrics.conversionRate.value}%
              </p>
            </div>
            <div className={`flex items-center ${
              currentMetrics.conversionRate.change >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {currentMetrics.conversionRate.change >= 0 ? (
                <ArrowTrendingUpIcon className="h-5 w-5" />
              ) : (
                <ArrowTrendingDownIcon className="h-5 w-5" />
              )}
              <span className="text-sm ml-1">
                {Math.abs(currentMetrics.conversionRate.change).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-4">
            <CurrencyDollarIcon className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Clicks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {currentMetrics.clicks.value.toLocaleString()}
              </p>
            </div>
            <div className={`flex items-center ${
              currentMetrics.clicks.change >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {currentMetrics.clicks.change >= 0 ? (
                <ArrowTrendingUpIcon className="h-5 w-5" />
              ) : (
                <ArrowTrendingDownIcon className="h-5 w-5" />
              )}
              <span className="text-sm ml-1">
                {Math.abs(currentMetrics.clicks.change).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-4">
            <CursorArrowRaysIcon className="h-8 w-8 text-pink-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Impressions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {currentMetrics.impressions.value.toLocaleString()}
              </p>
            </div>
            <div className={`flex items-center ${
              currentMetrics.impressions.change >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {currentMetrics.impressions.change >= 0 ? (
                <ArrowTrendingUpIcon className="h-5 w-5" />
              ) : (
                <ArrowTrendingDownIcon className="h-5 w-5" />
              )}
              <span className="text-sm ml-1">
                {Math.abs(currentMetrics.impressions.change).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-4">
            <UsersIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <select
                value={metric}
                onChange={(e) => {
                  setMetric(e.target.value as keyof Metrics);
                  if (e.target.value === 'roas') {
                    setShowRoasTooltip(true);
                  }
                }}
                className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500 pr-10"
              >
                {Object.entries(metrics).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              {metric === 'roas' && showRoasTooltip && (
                <div className="absolute left-0 mt-2 w-64 px-4 py-3 bg-gray-800 text-white text-sm rounded-md shadow-lg z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p>Below 100%: Losing money on ads</p>
                      <p className="mt-1">Above 200%: Healthy profitability</p>
                    </div>
                    <button
                      onClick={() => setShowRoasTooltip(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metrics[metric].color} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={metrics[metric].color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={metric === 'roas' ? [0, 300] : ['auto', 'auto']}
                tickFormatter={(value) =>
                  `${metrics[metric].prefix}${value.toLocaleString()}${metrics[metric].suffix}`
                }
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px' }}
                formatter={(value: number) =>
                  `${metrics[metric].prefix}${value.toLocaleString()}${metrics[metric].suffix}`
                }
                labelFormatter={(label) => `Date: ${label}`}
              />
              {metric === 'roas' && (
                <>
                  <ReferenceLine
                    y={100}
                    stroke="#EF4444"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Break Even (100%)',
                      position: 'right',
                      fill: '#EF4444',
                      fontSize: 12
                    }}
                  />
                  <ReferenceLine
                    y={200}
                    stroke="#10B981"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Target ROAS (200%)',
                      position: 'right',
                      fill: '#10B981',
                      fontSize: 12
                    }}
                  />
                </>
              )}
              <Area
                type="monotone"
                dataKey={metric}
                stroke={metrics[metric].color}
                fillOpacity={1}
                fill="url(#colorMetric)"
                isAnimationActive={true}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {metric === 'roas' && (
          <div className="mt-4 text-sm text-gray-500 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Break Even Line (100%): Below this line means losing money on ads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>Target ROAS (200%): Above this line indicates healthy profitability</span>
            </div>
          </div>
        )}
      </div>

      {/* Campaign Performance Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Campaign ROAS Comparison</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="3 3" label="Break Even" />
              <Bar
                dataKey="roas"
                name="ROAS %"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 