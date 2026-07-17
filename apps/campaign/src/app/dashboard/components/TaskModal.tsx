'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  UserCircleIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
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
  };
  onUpdateStatus: (status: string) => void;
}

export default function TaskModal({ isOpen, onClose, task, onUpdateStatus }: TaskModalProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);

  const handleSubmitTask = () => {
    if (task.status !== 'Completed') {
      return;
    }
    setIsSubmitting(true);
    // Add task submission logic here
    console.log('Submitting completed task:', task.id);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setIsAddingComment(true);
    // Add comment logic here
    console.log('Adding comment:', newComment);
    setTimeout(() => {
      setIsAddingComment(false);
      setNewComment('');
    }, 1000);
  };

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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-start sm:pt-16 sm:p-0">
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
                      {task.title}
                    </Dialog.Title>

                    {/* Task Details */}
                    <div className="mt-4 space-y-4">
                      {/* Status and Priority */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority} Priority
                          </span>
                        </div>
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateStatus(e.target.value)}
                          className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      {/* Assignment Info */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <UserCircleIcon className="h-5 w-5 mr-1" />
                          <span>Assigned by: {task.assignedBy || 'Admin'}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-1" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {task.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Comments Section */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Comments</h4>
                        <div className="mt-2 space-y-3 max-h-40 overflow-y-auto">
                          {task.comments?.map((comment) => (
                            <div key={comment.id} className="flex space-x-3 text-sm text-gray-500">
                              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{comment.author}</p>
                                <p>{comment.text}</p>
                                <p className="text-xs">{comment.timestamp}</p>
                              </div>
                            </div>
                          ))}
                          {(!task.comments || task.comments.length === 0) && (
                            <p className="text-sm text-gray-500">No comments yet.</p>
                          )}
                        </div>

                        {/* Add Comment Form */}
                        <div className="mt-4">
                          <textarea
                            rows={2}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Add a comment..."
                          />
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              type="button"
                              disabled={isAddingComment || !newComment.trim()}
                              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                                isAddingComment || !newComment.trim()
                                  ? 'bg-indigo-400 cursor-not-allowed'
                                  : 'bg-indigo-600 hover:bg-indigo-700'
                              }`}
                              onClick={handleAddComment}
                            >
                              {isAddingComment ? 'Adding...' : 'Add Comment'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Submit Task Button */}
                      <div className="mt-6 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            {task.status !== 'Completed' && (
                              <p className="flex items-center text-yellow-600">
                                <CheckCircleIcon className="h-5 w-5 mr-1" />
                                Mark as completed to submit
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            disabled={isSubmitting || task.status !== 'Completed'}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                              isSubmitting || task.status !== 'Completed'
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                            onClick={handleSubmitTask}
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Task'}
                          </button>
                        </div>
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