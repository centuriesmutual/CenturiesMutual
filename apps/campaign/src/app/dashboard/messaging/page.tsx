'use client';

import { useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  ClockIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

type Conversation = {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'online' | 'away' | 'offline';
  avatar: string;
};

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
};

export default function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Sample conversations data
  const conversations: Conversation[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Content Manager',
      lastMessage: 'Thanks for the feedback on the Q2 campaign!',
      timestamp: '2 min ago',
      unread: 0,
      status: 'online',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Marketing Director',
      lastMessage: 'Can we schedule a meeting for next week?',
      timestamp: '1 hour ago',
      unread: 2,
      status: 'away',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Design Lead',
      lastMessage: 'The new mockups are ready for review',
      timestamp: '3 hours ago',
      unread: 0,
      status: 'offline',
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Analytics Specialist',
      lastMessage: 'The campaign metrics look promising',
      timestamp: '1 day ago',
      unread: 1,
      status: 'online',
      avatar: 'DK'
    }
  ];

  // Sample messages for the selected conversation
  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Hi! I wanted to follow up on the Q2 campaign strategy we discussed.',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Thanks for reaching out! I\'ve reviewed the proposal and it looks great.',
      timestamp: '10:32 AM',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: 'Perfect! Should we schedule a team meeting to discuss the implementation?',
      timestamp: '10:35 AM',
      isOwn: false
    },
    {
      id: 4,
      sender: 'You',
      content: 'Yes, that sounds good. How about next Tuesday at 2 PM?',
      timestamp: '10:36 AM',
      isOwn: true
    },
    {
      id: 5,
      sender: 'Sarah Johnson',
      content: 'Thanks for the feedback on the Q2 campaign!',
      timestamp: '2 min ago',
      isOwn: false
    }
  ];

  // Sample messages for each conversation
  const conversationMessages: Record<number, Message[]> = {
    1: [
      { id: 1, sender: 'Sarah Johnson', content: 'Hi! I wanted to follow up on the Q2 campaign strategy we discussed.', timestamp: '10:30 AM', isOwn: false },
      { id: 2, sender: 'You', content: 'Thanks for reaching out! I\'ve reviewed the proposal and it looks great.', timestamp: '10:32 AM', isOwn: true },
      { id: 3, sender: 'Sarah Johnson', content: 'Perfect! Should we schedule a team meeting to discuss the implementation?', timestamp: '10:35 AM', isOwn: false },
      { id: 4, sender: 'You', content: 'Yes, that sounds good. How about next Tuesday at 2 PM?', timestamp: '10:36 AM', isOwn: true },
      { id: 5, sender: 'Sarah Johnson', content: 'Thanks for the feedback on the Q2 campaign!', timestamp: '2 min ago', isOwn: false }
    ],
    2: [
      { id: 1, sender: 'Mike Chen', content: 'Hey! Can we schedule a meeting for next week?', timestamp: '1 hour ago', isOwn: false },
      { id: 2, sender: 'You', content: 'Absolutely! What day works best for you?', timestamp: '1 hour ago', isOwn: true },
      { id: 3, sender: 'Mike Chen', content: 'How about Wednesday morning around 10 AM?', timestamp: '45 min ago', isOwn: false }
    ],
    3: [
      { id: 1, sender: 'Emily Rodriguez', content: 'The new mockups are ready for review', timestamp: '3 hours ago', isOwn: false },
      { id: 2, sender: 'You', content: 'Great! I\'ll take a look and get back to you with feedback.', timestamp: '2 hours ago', isOwn: true }
    ],
    4: [
      { id: 1, sender: 'David Kim', content: 'The campaign metrics look promising', timestamp: '1 day ago', isOwn: false },
      { id: 2, sender: 'You', content: 'That\'s excellent news! Can you share the detailed report?', timestamp: '1 day ago', isOwn: true },
      { id: 3, sender: 'David Kim', content: 'Sure, I\'ll send it over shortly.', timestamp: '23 hours ago', isOwn: false }
    ]
  } as Record<number, Message[]>;

  const handleConversationClick = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setShowConversationModal(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-3">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Messaging</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
                <button
                  onClick={() => setShowNewMessageModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  title="New Message"
                >
                  <PlusIcon className="h-5 w-5 text-indigo-600" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-indigo-50 border-indigo-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-700">
                          {conversation.avatar}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {conversation.role}
                        </span>
                        {conversation.unread > 0 && (
                          <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
            </div>
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">New Message</h3>
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Type your message..."
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle send message logic here
                    setShowNewMessageModal(false);
                  }}
                  className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversation Modal */}
      {showConversationModal && currentConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-700">
                        {currentConversation.avatar}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(currentConversation.status)}`}></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{currentConversation.name}</h3>
                    <p className="text-sm text-gray-500">{currentConversation.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConversationModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(conversationMessages[currentConversation.id] ?? []).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isOwn
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isOwn ? 'text-indigo-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
