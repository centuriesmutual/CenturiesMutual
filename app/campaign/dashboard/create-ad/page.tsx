'use client';

import { useState } from 'react';
import {
  PhotoIcon,
  VideoCameraIcon,
  LinkIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function CreateAdPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'image',
    targetUrl: '',
    budget: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    placement: 'social',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement ad creation logic
    console.log('Ad creation data:', formData);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Ad Campaign</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Ad Title
              </label>
              <input
                type="text"
                id="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Use AI to generate catchy titles: <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">ChatGPT</a>
              </p>
            </div>

            <div>
              <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700">
                Destination URL
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <LinkIcon className="h-5 w-5" />
                </span>
                <input
                  type="url"
                  id="targetUrl"
                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Ad Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Generate compelling copy with: <a href="https://www.copy.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Copy.ai</a>
            </p>
          </div>

          {/* Media Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mediaType: 'image' })}
                className={`p-4 border rounded-lg flex items-center ${
                  formData.mediaType === 'image'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300'
                }`}
              >
                <PhotoIcon className="h-6 w-6 mr-2 text-indigo-600" />
                <div className="text-left">
                  <div className="font-medium">Image Ad</div>
                  <div className="text-sm text-gray-500">Static images or banners</div>
                  <div className="mt-1 text-xs text-indigo-600">
                    Create with: <a href="https://labs.openai.com" target="_blank" rel="noopener noreferrer" className="hover:underline">DALL-E</a> or{' '}
                    <a href="https://www.midjourney.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Midjourney</a>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mediaType: 'video' })}
                className={`p-4 border rounded-lg flex items-center ${
                  formData.mediaType === 'video'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300'
                }`}
              >
                <VideoCameraIcon className="h-6 w-6 mr-2 text-indigo-600" />
                <div className="text-left">
                  <div className="font-medium">Video Ad</div>
                  <div className="text-sm text-gray-500">Video content or animations</div>
                  <div className="mt-1 text-xs text-indigo-600">
                    Create with: <a href="https://www.synthesia.io" target="_blank" rel="noopener noreferrer" className="hover:underline">Synthesia</a>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                Budget
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <CurrencyDollarIcon className="h-5 w-5" />
                </span>
                <input
                  type="number"
                  id="budget"
                  min="0"
                  step="0.01"
                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                Target Audience
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <UserGroupIcon className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  id="targetAudience"
                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., Age 25-34, Interest in Technology"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <CalendarDaysIcon className="h-5 w-5" />
                </span>
                <input
                  type="date"
                  id="startDate"
                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <CalendarDaysIcon className="h-5 w-5" />
                </span>
                <input
                  type="date"
                  id="endDate"
                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Placement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Placement</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, placement: 'social' })}
                className={`p-4 border rounded-lg flex items-center ${
                  formData.placement === 'social'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300'
                }`}
              >
                <UserGroupIcon className="h-6 w-6 mr-2 text-indigo-600" />
                <span>Social Media</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, placement: 'web' })}
                className={`p-4 border rounded-lg flex items-center ${
                  formData.placement === 'web'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300'
                }`}
              >
                <GlobeAltIcon className="h-6 w-6 mr-2 text-indigo-600" />
                <span>Display Network</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, placement: 'search' })}
                className={`p-4 border rounded-lg flex items-center ${
                  formData.placement === 'search'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300'
                }`}
              >
                <SparklesIcon className="h-6 w-6 mr-2 text-indigo-600" />
                <span>Search Results</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 