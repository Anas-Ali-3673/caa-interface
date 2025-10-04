'use client';

import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && (!user || !token)) {
      router.push('/sign-in');
    }
  }, [user, token, router, authLoading]);

  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/tickets`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const createdTicket = await response.json();
      setTickets(prev => [createdTicket, ...prev]);
      setNewTicket({ title: '', description: '', priority: 'medium' });
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }

      const updatedTicket = await response.json();
      setTickets(prev => prev.map(ticket => 
        ticket._id === ticketId ? updatedTicket : ticket
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!token) return;

    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      setTickets(prev => prev.filter(ticket => ticket._id !== ticketId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ticket');
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  if (!user || !token) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecting to login...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Helpdesk Dashboard
              </h1>
              <span className="ml-4 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                {user.role}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              
              {user.role === 'admin' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  Admin Panel
                </button>
              )}
              
              <button
                onClick={logout}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Create Ticket Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            Create New Ticket
          </button>
        </div>

        {/* Create Ticket Form */}
        {showCreateForm && (
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Create New Ticket</h2>
            <form onSubmit={createTicket} className="space-y-4">
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
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {user.role === 'admin' ? 'All Tickets' : 'My Tickets'}
            </h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No tickets found. Create your first ticket!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {ticket.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{ticket.description}</p>
                      
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority} priority
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex space-x-2">
                      {ticket.status !== 'closed' && (
                        <select
                          value={ticket.status}
                          onChange={(e) => updateTicketStatus(ticket._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                      )}
                      
                      {(user.role === 'admin' || ticket.createdBy === user._id) && (
                        <button
                          onClick={() => deleteTicket(ticket._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}