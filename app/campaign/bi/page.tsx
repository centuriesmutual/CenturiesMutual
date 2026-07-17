'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FireIcon,
  StarIcon,
  BanknotesIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function AdvancedBIPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  // Sample data for advanced BI
  const performanceData = {
    dailyEngagement: [
      { day: 'Mon', engagement: 78, views: 1250 },
      { day: 'Tue', engagement: 95, views: 2100 },
      { day: 'Wed', engagement: 82, views: 1750 },
      { day: 'Thu', engagement: 97, views: 2300 },
      { day: 'Fri', engagement: 85, views: 1950 },
      { day: 'Sat', engagement: 72, views: 1400 },
      { day: 'Sun', engagement: 68, views: 1200 }
    ],
    wordCountPerformance: [
      { range: '0-400', attention: 45, avgTime: 65, bounceRate: 35 },
      { range: '400-800', attention: 72, avgTime: 78, bounceRate: 22 },
      { range: '800-1200', attention: 100, avgTime: 94, bounceRate: 6 },
      { range: '1200+', attention: 78, avgTime: 87, bounceRate: 13 }
    ],
    audienceDemographics: [
      { 
        age: '18-24', 
        growth: 12, 
        engagement: 82, 
        revenue: 1800,
        percentage: 15,
        avgSessionTime: 3.2,
        devicePreference: 'Mobile',
        topContent: 'Social Media',
        peakTime: 'Evening',
        gender: { male: 45, female: 55 },
        location: { urban: 78, suburban: 22 },
        education: { college: 65, highschool: 35 }
      },
      { 
        age: '25-34', 
        growth: 28, 
        engagement: 94, 
        revenue: 4200,
        percentage: 35,
        avgSessionTime: 4.8,
        devicePreference: 'Mobile',
        topContent: 'Strategy',
        peakTime: 'Lunch',
        gender: { male: 52, female: 48 },
        location: { urban: 82, suburban: 18 },
        education: { college: 78, highschool: 22 }
      },
      { 
        age: '35-44', 
        growth: 18, 
        engagement: 89, 
        revenue: 3100,
        percentage: 28,
        avgSessionTime: 4.1,
        devicePreference: 'Desktop',
        topContent: 'Email',
        peakTime: 'Morning',
        gender: { male: 48, female: 52 },
        location: { urban: 65, suburban: 35 },
        education: { college: 82, highschool: 18 }
      },
      { 
        age: '45-54', 
        growth: 8, 
        engagement: 76, 
        revenue: 1900,
        percentage: 15,
        avgSessionTime: 3.5,
        devicePreference: 'Desktop',
        topContent: 'SEO',
        peakTime: 'Morning',
        gender: { male: 55, female: 45 },
        location: { urban: 58, suburban: 42 },
        education: { college: 85, highschool: 15 }
      },
      { 
        age: '55+', 
        growth: 5, 
        engagement: 68, 
        revenue: 1200,
        percentage: 7,
        avgSessionTime: 2.8,
        devicePreference: 'Desktop',
        topContent: 'Strategy',
        peakTime: 'Morning',
        gender: { male: 60, female: 40 },
        location: { urban: 45, suburban: 55 },
        education: { college: 88, highschool: 12 }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Campaign</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Business Intelligence</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
              <EyeIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">89,420</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>+12.5% from last period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Avg Engagement</h3>
              <StarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">91.2%</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>+3.1% from last period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
              <BanknotesIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$18,400</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>+15.7% from last period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Content Pieces</h3>
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">87</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>+8.2% from last period</span>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Publications</h3>
              <CalendarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="space-y-4">
              {performanceData.dailyEngagement.map((day) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-700">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Engagement</span>
                      <span className="text-sm font-semibold text-gray-900">{day.engagement}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${day.engagement}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Views: {day.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Word Count Analysis */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Content Length Analysis</h3>
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              {performanceData.wordCountPerformance.map((range) => (
                <div key={range.range} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{range.range} words</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      range.range === '800-1200' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {range.range === '800-1200' ? 'Optimal' : 'Standard'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Attention:</span>
                      <span className="ml-1 font-semibold">{range.attention}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Time:</span>
                      <span className="ml-1 font-semibold">{range.avgTime}s</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Bounce Rate:</span>
                      <span className="ml-1 font-semibold">{range.bounceRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Audience Demographics & Performance</h3>
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          
          {/* Overall Audience Overview */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-700 mb-1">15,420</div>
              <div className="text-sm text-purple-600">Total Audience</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-700 mb-1">4.2 min</div>
              <div className="text-sm text-blue-600">Avg Session Time</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700 mb-1">87%</div>
              <div className="text-sm text-green-600">Mobile Users</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-700 mb-1">$12,200</div>
              <div className="text-sm text-orange-600">Total Revenue</div>
            </div>
          </div>

          {/* Detailed Age Group Analysis */}
          <div className="space-y-6">
            {performanceData.audienceDemographics.map((demo, index) => (
              <div key={demo.age} className={`p-6 rounded-xl border-l-4 ${
                index === 1 ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500' :
                index === 2 ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-500' :
                'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-400'
              }`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Primary Metrics */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-gray-900">{demo.age}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              index === 1 ? 'bg-purple-600' : index === 2 ? 'bg-blue-600' : 'bg-gray-600'
                            }`}
                            style={{ width: `${demo.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{demo.percentage}%</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-gray-900">+{demo.growth}%</div>
                        <div className="text-xs text-gray-500">Growth</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{demo.engagement}%</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{demo.avgSessionTime}m</div>
                        <div className="text-xs text-gray-500">Session Time</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-gray-900">${demo.revenue}</div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                    </div>
                  </div>

                  {/* Device & Behavior */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800">Device & Behavior</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Device Preference</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          demo.devicePreference === 'Mobile' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {demo.devicePreference}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Peak Time</span>
                        <span className="text-sm font-medium text-gray-900">{demo.peakTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Top Content</span>
                        <span className="text-sm font-medium text-gray-900">{demo.topContent}</span>
                      </div>
                    </div>
                  </div>

                  {/* Demographics Breakdown */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800">Demographics</h5>
                    <div className="space-y-3">
                      {/* Gender */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Gender</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${demo.gender.male}%` }}></div>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${demo.gender.female}%` }}></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Male {demo.gender.male}%</span>
                          <span>Female {demo.gender.female}%</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Location</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${demo.location.urban}%` }}></div>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${demo.location.suburban}%` }}></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Urban {demo.location.urban}%</span>
                          <span>Suburban {demo.location.suburban}%</span>
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Education</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${demo.education.college}%` }}></div>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${demo.education.highschool}%` }}></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>College {demo.education.college}%</span>
                          <span>HS {demo.education.highschool}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}