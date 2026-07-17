'use client';

import { useState } from 'react';
import {
  VideoCameraIcon,
  UserCircleIcon,
  PencilIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface Profile {
  name: string;
  role: string;
  department: string;
  email: string;
  photoUrl: string;
  status: 'available' | 'busy' | 'away' | 'offline';
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface ChatContact {
  id: number;
  name: string;
  photoUrl: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'available' | 'busy' | 'away' | 'offline';
  department: string;
}

export default function ChatMeetingsPage() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    role: '',
    department: '',
    email: '',
    photoUrl: '',
    status: 'available'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for chat contacts
  const chatContacts: ChatContact[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      photoUrl: "",
      lastMessage: "Can you review the latest campaign?",
      timestamp: "10:30 AM",
      unreadCount: 2,
      status: 'available',
      department: 'Marketing'
    },
    {
      id: 2,
      name: "Mike Chen",
      photoUrl: "",
      lastMessage: "Meeting notes are ready",
      timestamp: "9:45 AM",
      unreadCount: 0,
      status: 'busy',
      department: 'Design'
    },
    {
      id: 3,
      name: "Emma Davis",
      photoUrl: "",
      lastMessage: "Updated the content calendar",
      timestamp: "Yesterday",
      unreadCount: 1,
      status: 'away',
      department: 'Content'
    }
  ];

  const filteredContacts = chatContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample messages for selected chat
  const messages: Message[] = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi! Can you review the latest campaign?",
      timestamp: "10:30 AM",
      isCurrentUser: false
    },
    {
      id: 2,
      sender: "You",
      content: "Sure, I'll take a look right now.",
      timestamp: "10:31 AM",
      isCurrentUser: true
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content: "Thanks! The assets are in the shared folder.",
      timestamp: "10:32 AM",
      isCurrentUser: false
    }
  ];

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Add message handling logic here
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Google Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="your.email@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your role"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Photo URL</label>
                <input
                  type="url"
                  value={profile.photoUrl}
                  onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={profile.status}
                  onChange={(e) => setProfile({ ...profile, status: e.target.value as Profile['status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="away">Away</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSaving ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-24 w-24 text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-1 text-sm text-gray-900">{profile.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{profile.email || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="mt-1 text-sm text-gray-900">{profile.role || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="mt-1 text-sm text-gray-900">{profile.department || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{profile.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Search coworkers by name or department..."
            />
          </div>
          {searchQuery && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {filteredContacts.length} result{filteredContacts.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Contacts List */}
          <div className="border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedChat(contact.id)}
                  className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 ${
                    selectedChat === contact.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {contact.photoUrl ? (
                      <img
                        src={contact.photoUrl}
                        alt={contact.name}
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="h-12 w-12 text-gray-300" />
                    )}
                    <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                      contact.status === 'available' ? 'bg-green-400' :
                      contact.status === 'busy' ? 'bg-red-400' :
                      contact.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.timestamp}</p>
                    </div>
                    <p className="text-xs text-gray-500">{contact.department}</p>
                    <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                  </div>
                  {contact.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs font-medium text-white">
                      {contact.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-2 flex flex-col h-[500px]">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {chatContacts.find(c => c.id === selectedChat)?.name}
                      </h3>
                      <p className="text-xs text-gray-500">Active now</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <EllipsisHorizontalIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${
                        message.isCurrentUser
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isCurrentUser ? 'text-indigo-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full p-2 bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No chat selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meeting Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Main Office</h3>
                <p className="text-sm text-gray-500">Join the main office virtual space</p>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <VideoCameraIcon className="h-5 w-5 mr-2" />
              Join Office
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <VideoCameraIcon className="h-8 w-8 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Join Meeting</h3>
                <p className="text-sm text-gray-500">Join an existing meeting</p>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <VideoCameraIcon className="h-5 w-5 mr-2" />
              Join Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 