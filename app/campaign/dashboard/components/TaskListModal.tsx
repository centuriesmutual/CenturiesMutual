'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import {
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: string;
  status: string;
  assignedBy?: string;
  assignedDate?: string;
  comments?: Array<{
    id: number;
    author: string;
    text: string;
    timestamp: string;
  }>;
}

interface TaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function TaskListModal({ isOpen, onClose, tasks, onTaskClick }: TaskListModalProps) {
  const [selectedTab, setSelectedTab] = useState('current');

  const currentTasks = tasks.filter(task => task.status !== 'Completed');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Task List
                      </Dialog.Title>

                      <div className="mt-4">
                        <Tab.Group onChange={(index) => setSelectedTab(index === 0 ? 'current' : 'completed')}>
                          <Tab.List className="flex space-x-4 border-b border-gray-200">
                            <Tab
                              className={({ selected }) =>
                                `pb-4 px-1 text-sm font-medium border-b-2 ${
                                  selected
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`
                              }
                            >
                              Current Tasks ({currentTasks.length})
                            </Tab>
                            <Tab
                              className={({ selected }) =>
                                `pb-4 px-1 text-sm font-medium border-b-2 ${
                                  selected
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`
                              }
                            >
                              Completed Tasks ({completedTasks.length})
                            </Tab>
                          </Tab.List>
                          <Tab.Panels className="mt-4">
                            <Tab.Panel className="space-y-3">
                              {currentTasks.map((task) => (
                                <div
                                  key={task.id}
                                  onClick={() => onTaskClick(task)}
                                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                  <div className={`p-2 rounded-lg ${
                                    task.priority === 'High' ? 'bg-red-100' :
                                    task.priority === 'Medium' ? 'bg-yellow-100' :
                                    'bg-green-100'
                                  }`}>
                                    <ClockIcon className={`h-5 w-5 ${
                                      task.priority === 'High' ? 'text-red-600' :
                                      task.priority === 'Medium' ? 'text-yellow-600' :
                                      'text-green-600'
                                    }`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {task.title}
                                      </p>
                                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {task.status}
                                      </span>
                                    </div>
                                    <div className="mt-1 flex items-center text-xs text-gray-500">
                                      <UserCircleIcon className="h-4 w-4 mr-1" />
                                      <span>{task.assignedBy}</span>
                                      <span className="mx-2">•</span>
                                      <span>Due: {task.dueDate}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </Tab.Panel>
                            <Tab.Panel className="space-y-3">
                              {completedTasks.map((task) => (
                                <div
                                  key={task.id}
                                  onClick={() => onTaskClick(task)}
                                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                  <div className="p-2 rounded-lg bg-green-100">
                                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {task.title}
                                      </p>
                                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                        Completed
                                      </span>
                                    </div>
                                    <div className="mt-1 flex items-center text-xs text-gray-500">
                                      <UserCircleIcon className="h-4 w-4 mr-1" />
                                      <span>{task.assignedBy}</span>
                                      <span className="mx-2">•</span>
                                      <span>Completed: {task.dueDate}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </Tab.Panel>
                          </Tab.Panels>
                        </Tab.Group>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 