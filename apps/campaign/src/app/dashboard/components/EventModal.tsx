'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: Array<{
    id: number;
    title: string;
    time: string;
    date: string;
    type: 'meeting' | 'review' | 'event';
  }>;
}

export default function EventModal({ isOpen, onClose, date, events }: EventModalProps) {
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Events for {date.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Dialog.Title>

                    <div className="mt-4">
                      {events.length > 0 ? (
                        <div className="space-y-3">
                          {events.map((event) => (
                            <div
                              key={event.id}
                              className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                            >
                              <div className={`p-2 rounded-lg ${
                                event.type === 'meeting' ? 'bg-purple-100' :
                                event.type === 'review' ? 'bg-blue-100' :
                                'bg-green-100'
                              }`}>
                                {event.type === 'meeting' ? (
                                  <UserGroupIcon className="h-5 w-5 text-purple-600" />
                                ) : event.type === 'review' ? (
                                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <CalendarIcon className="h-5 w-5 text-green-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    {event.time}
                                  </div>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    event.type === 'meeting' ? 'bg-purple-100 text-purple-800' :
                                    event.type === 'review' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No events scheduled for this day
                        </p>
                      )}
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