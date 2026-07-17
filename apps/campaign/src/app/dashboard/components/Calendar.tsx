'use client';

import { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import EventModal from './EventModal';
import Clock from './Clock';
import { eventService, Event } from '../../../services/eventService';

interface CalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function Calendar({ events, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'meeting' as 'meeting' | 'review' | 'event'
  });
  const [isCreating, setIsCreating] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const getDayEvents = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      const eventDate = new Date(event.date === 'Today' 
        ? new Date() 
        : event.date === 'Tomorrow'
        ? new Date().setDate(new Date().getDate() + 1)
        : event.date);
      return eventDate.toDateString() === new Date(dateStr).toDateString();
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear() &&
      day === today.getDate();
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowEventModal(true);
  };

  const handleCreateEvent = async () => {
    if (newEvent.title.trim() && newEvent.time.trim() && selectedDate) {
      setIsCreating(true);
      
      try {
        const eventData = {
          title: newEvent.title,
          time: newEvent.time,
          date: eventService.formatDateForStorage(selectedDate),
          type: newEvent.type
        };

        const createdEvent = await eventService.createEvent(eventData);
        
        if (createdEvent) {
          console.log('Event created successfully:', createdEvent);
          
          // Reset form and close modal
          setNewEvent({ title: '', time: '', type: 'meeting' });
          setShowEventModal(false);
          setSelectedDate(null);
          
          // Refresh the page to show the new event
          window.location.reload();
        } else {
          console.error('Failed to create event');
          alert('Failed to create event. Please try again.');
        }
      } catch (error) {
        console.error('Error creating event:', error);
        alert('Failed to create event. Please try again.');
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          </button>
          <h2 className="text-sm font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <Clock />
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-16 bg-white p-1" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayEvents = getDayEvents(day);
          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className={`h-16 p-1 bg-white hover:bg-gray-50 cursor-pointer ${
                isToday(day) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="text-right">
                <span className={`text-xs ${isToday(day) ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                  {day}
                </span>
              </div>
              <div className="mt-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`text-xs px-1 mb-0.5 rounded truncate ${
                      event.type === 'meeting' ? 'bg-purple-100 text-purple-800' :
                      event.type === 'review' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 pl-1">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Creation Modal */}
      {showEventModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create Event</h3>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedDate(null);
                    setNewEvent({ title: '', time: '', type: 'meeting' });
                  }}
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
                    Date
                  </label>
                  <div className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-600">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Enter event title..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'meeting' | 'review' | 'event' })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="review">Review</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedDate(null);
                    setNewEvent({ title: '', time: '', type: 'meeting' });
                  }}
                  className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title.trim() || !newEvent.time.trim() || isCreating}
                  className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 