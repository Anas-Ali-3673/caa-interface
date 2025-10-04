'use client';

import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import CreateTicketForm from './components/CreateTicketForm';
import TicketsList from './components/TicketsList';
import ErrorDisplay from '../admin/components/ErrorDisplay';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdBy: {
    _id: string;
    name?: string;
    email: string;
  } | string;
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && (!user || !token)) {
      router.push('/sign-in');
    }
  }, [user, token, router, authLoading]);

  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      if (!token || !user) return;
      
      try {
        console.log('Fetching tickets for user:', user.role, user._id);
        const response = await fetch(`${API_BASE_URL}/api/tickets`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to fetch tickets: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received tickets:', data);
        setTickets(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token, user]);

  const createTicket = async (newTicket: { title: string; description: string; priority: 'low' | 'medium' | 'high' }) => {
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
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    if (!token || (user?.role !== 'Admin' && user?.role !== 'admin')) {
      setError('Only admins can update ticket status');
      return;
    }

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
      <DashboardHeader user={user} onLogout={logout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorDisplay error={error} onDismiss={() => setError(null)} />

        {/* Create Ticket Button - Users Only */}
        {user.role !== 'Admin' && user.role !== 'admin' && (
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
            >
              Create New Ticket
            </button>
          </div>
        )}

        {/* Create Ticket Form - Users Only */}
        {(user.role !== 'Admin' && user.role !== 'admin') && showCreateForm && (
          <CreateTicketForm 
            onSubmit={createTicket}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Admin View Info */}
        {(user.role === 'Admin' || user.role === 'admin') && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Admin View: You can see and manage all users' tickets
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Total tickets: {tickets.length}
                </p>
              </div>
            </div>
          </div>
        )}

        <TicketsList 
          tickets={tickets}
          loading={loading}
          user={user}
          onUpdateStatus={updateTicketStatus}
          onDeleteTicket={deleteTicket}
        />
      </main>
    </div>
  );
}