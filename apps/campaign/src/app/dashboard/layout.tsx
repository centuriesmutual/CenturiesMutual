'use client';

import { useState } from 'react';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  WalletIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, shortName: 'Home' },
  { name: 'Messaging', href: '/dashboard/messaging', icon: ChatBubbleLeftRightIcon, shortName: 'Messaging' },
  { name: 'Submissions', href: '/dashboard/submit-content', icon: DocumentTextIcon, shortName: 'Submissions' },
  { name: 'Intelligence', href: '/dashboard/settings', icon: ChartBarIcon, shortName: 'Intelligence' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const handleBalanceClick = () => {
    // Redirect to account balance page
    window.location.href = '/dashboard/account-balance';
  };

  const handleLogout = () => {
    // Redirect to login page
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Title Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 py-4">Marketing Hub</h1>
            <div className="flex items-center space-x-4">
              <div 
                className="bg-green-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-green-100 transition-colors flex items-center space-x-2"
                onClick={handleBalanceClick}
              >
                <WalletIcon className="h-5 w-5 text-green-700" />
                <span className="text-lg font-semibold text-green-700">Account Balance</span>
              </div>
              <div className="relative">
                <Cog6ToothIcon 
                  className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" 
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                />
                {showSettingsDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <nav className="flex justify-between sm:justify-start sm:space-x-6" aria-label="Tabs">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group inline-flex items-center px-1 sm:px-2 py-2 sm:py-4 text-xs sm:text-sm font-medium border-b-2 
                    ${isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                  <span className="hidden sm:inline">{item.name}</span>
                  <span className="sm:hidden">{item.shortName}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 