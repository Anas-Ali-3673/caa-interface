'use client';

import { useState } from 'react';

interface NewTicket {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface CreateTicketFormProps {
  onSubmit: (ticket: NewTicket) => Promise<void>;
  onCancel: () => void;
}

export default function CreateTicketForm({ onSubmit, onCancel }: CreateTicketFormProps) {
  const [newTicket, setNewTicket] = useState<NewTicket>({
    title: '',
    description: '',
    priority: 'medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newTicket);
    setNewTicket({ title: '', description: '', priority: 'medium' });
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-4">Create New Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            required
            value={newTicket.title}
            onChange={(e) => setNewTicket(prev => ({...prev, title: e.target.value}))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            required
            rows={3}
            value={newTicket.description}
            onChange={(e) => setNewTicket(prev => ({...prev, description: e.target.value}))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={newTicket.priority}
            onChange={(e) => setNewTicket(prev => ({...prev, priority: e.target.value as any}))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Ticket
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}