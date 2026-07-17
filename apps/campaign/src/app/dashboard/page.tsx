'use client';

import {
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import TaskModal from './components/TaskModal';
import Calendar from './components/Calendar';
import TaskListModal from './components/TaskListModal';
import { eventService, Event } from '../../services/eventService';

export default function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof upcomingEvents[0] | null>(null);
  const [isTaskListModalOpen, setIsTaskListModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const loadedEvents = await eventService.getEvents();
        setEvents(loadedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  // Convert API events to the format expected by the component
  const upcomingEvents: Array<{
    id: number;
    title: string;
    time: string;
    date: string;
    type: 'meeting' | 'review' | 'event';
  }> = events.map(event => ({
    id: event.id,
    title: event.title,
    time: event.time,
    date: eventService.formatDateForDisplay(event.date),
    type: event.type
  }));

  const recentActivity = upcomingEvents.map(event => ({
    id: event.id,
    title: event.title,
    description: `${event.date} • ${event.time}`,
    icon: CalendarIcon,
    timestamp: event.date === 'Today' ? 'Today' : event.date === 'Tomorrow' ? 'Tomorrow' : event.date,
    type: event.type
  }));


  const tasks = [
    {
      id: 1,
      title: 'Review Q2 Marketing Plan',
      description: 'Review and provide feedback on the Q2 marketing strategy and budget allocation.',
      dueDate: 'Today',
      priority: 'High',
      status: 'In Progress',
      assignedBy: 'Sarah Johnson',
      assignedDate: '2024-03-15',
      comments: [
        {
          id: 1,
          author: 'Sarah Johnson',
          text: 'Please focus on the digital marketing aspects.',
          timestamp: '2 days ago'
        }
      ]
    },
    {
      id: 2,
      title: 'Create Social Media Posts',
      description: 'Design and schedule social media content for the upcoming product launch.',
      dueDate: 'Tomorrow',
      priority: 'Medium',
      status: 'Not Started',
      assignedBy: 'Mike Chen',
      assignedDate: '2024-03-16'
    },
    {
      id: 3,
      title: 'Update Website Content',
      description: 'Refresh the website content with new product information and customer testimonials.',
      dueDate: 'Next Week',
      priority: 'Low',
      status: 'In Progress',
      assignedBy: 'Lisa Wong',
      assignedDate: '2024-03-14'
    }
  ];


  const handleTaskClick = (task: typeof tasks[0]) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleUpdateTaskStatus = (newStatus: string) => {
    if (selectedTask) {
      // Update task status logic here
      console.log(`Updating task ${selectedTask.id} status to ${newStatus}`);
    }
  };

  const handleSubmitNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add new task logic here
    console.log('Submitting new task:', newTaskTitle);
    setTimeout(() => {
      setIsSubmitting(false);
      setNewTaskTitle('');
    }, 1000);
  };

  const handleEventClick = (event: typeof upcomingEvents[0]) => {
    setSelectedEvent(event);
    // You can add more functionality here, like opening a modal
    console.log('Event clicked:', event);
  };

  const handleViewAllTasks = () => {
    setIsTaskListModalOpen(true);
  };

  const dashboardContent = (
    <div className="space-y-6">
      {/* Tasks and Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar - Will be first on mobile */}
        <div className="order-first lg:order-last">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Calendar 
              events={events} 
              onEventClick={(event) => {
                const convertedEvent = {
                  id: event.id,
                  title: event.title,
                  time: event.time,
                  date: eventService.formatDateForDisplay(event.date),
                  type: event.type
                };
                handleEventClick(convertedEvent);
              }} 
            />
          </div>
        </div>

        {/* Tasks Section */}
        <div className="order-last lg:order-first">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
              <button
                onClick={handleViewAllTasks}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                View All
              </button>
            </div>
            {/* Task list content */}
            <div className="space-y-4">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        Due: {task.dueDate} • {task.priority} Priority
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event) => {
            const isToday = event.date === 'Today';
            return (
              <div
                key={event.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                  isToday 
                    ? 'bg-indigo-50 hover:bg-indigo-100 border border-indigo-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleEventClick(event)}
              >
                <div className={`p-2 rounded-lg ${
                  event.type === 'meeting' 
                    ? isToday ? 'bg-purple-200' : 'bg-purple-100'
                    : event.type === 'review' 
                    ? isToday ? 'bg-blue-200' : 'bg-blue-100'
                    : isToday ? 'bg-green-200' : 'bg-green-100'
                }`}>
                  <CalendarIcon className={`h-5 w-5 ${
                    event.type === 'meeting' 
                      ? isToday ? 'text-purple-700' : 'text-purple-600'
                      : event.type === 'review' 
                      ? isToday ? 'text-blue-700' : 'text-blue-600'
                      : isToday ? 'text-green-700' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    isToday ? 'text-indigo-900' : 'text-gray-900'
                  }`}>
                    {event.title}
                    {isToday && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                        Today
                      </span>
                    )}
                  </p>
                  <p className={`text-xs ${
                    isToday ? 'text-indigo-600 font-medium' : 'text-gray-500'
                  }`}>
                    {event.date} • {event.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );

  return (
    <div className="space-y-6">
      {/* Dashboard Content */}
      {dashboardContent}

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          task={selectedTask}
          onUpdateStatus={handleUpdateTaskStatus}
        />
      )}
    </div>
  );
} 