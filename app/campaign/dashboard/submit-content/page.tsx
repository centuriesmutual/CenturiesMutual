'use client';

import { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  PhotoIcon,
  FolderIcon,
  CalendarDaysIcon,
  CloudArrowUpIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

export default function SubmitContentPage() {
  const [formData, setFormData] = useState({
    title: '',
    boxFileUrl: '',
    featuredImage: null as File | null,
    publishDate: '',
  });

  // Set current datetime when component mounts
  useEffect(() => {
    const now = new Date();
    // Convert to Central Time (UTC-6 for CST, UTC-5 for CDT)
    const centralTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Chicago"}));
    // Format datetime-local input value (YYYY-MM-DDTHH:MM)
    const formattedDateTime = centralTime.toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, publishDate: formattedDateTime }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement content submission logic
    console.log('Content submission data:', formData);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit Blog Post or Article</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Box File Integration */}
          <div>
            <label htmlFor="boxFileUrl" className="block text-sm font-medium text-gray-700">
              Box Document
            </label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Connect to your Box account to select your article document
                </p>
              </div>
              <div className="mt-4">
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                    <LinkIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="url"
                    id="boxFileUrl"
                    className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Paste your Box document URL here"
                    value={formData.boxFileUrl}
                    onChange={(e) => setFormData({ ...formData, boxFileUrl: e.target.value })}
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Share your Box document with edit access before submitting
                </p>
              </div>
            </div>
          </div>


          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Featured Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData({ ...formData, featuredImage: file });
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Publish Date */}
          <div>
            <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
              Publish Date
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                <CalendarDaysIcon className="h-5 w-5" />
              </span>
              <input
                type="datetime-local"
                id="publishDate"
                className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 