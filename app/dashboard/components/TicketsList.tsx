'use client';

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

interface User {
  _id: string;
  email: string;
  role: string;
}

interface TicketsListProps {
  tickets: Ticket[];
  loading: boolean;
  user: User;
  onUpdateStatus: (ticketId: string, status: string) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export default function TicketsList({ tickets, loading, user, onUpdateStatus, onDeleteTicket }: TicketsListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          {user.role === 'Admin' ? 'All Tickets' : 'My Tickets'}
        </h2>
      </div>
      
      {tickets.length === 0 ? (
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
                    {user.role === 'Admin' && typeof ticket.createdBy === 'object' && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        By: {ticket.createdBy.name || ticket.createdBy.email}
                      </span>
                    )}
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
                
                <div className="ml-4 flex flex-col space-y-2">
                  {/* Status Update - Admin Only */}
                  {user.role === 'Admin' ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Status:</span>
                      <select
                        value={ticket.status}
                        onChange={(e) => onUpdateStatus(ticket._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Status: <span className="font-medium capitalize">{ticket.status.replace('-', ' ')}</span>
                    </div>
                  )}
                  
                  {/* Delete Button - Admin or Creator */}
                  {(user.role === 'Admin' || 
                    (typeof ticket.createdBy === 'string' ? ticket.createdBy === user._id : ticket.createdBy._id === user._id)) && (
                    <button
                      onClick={() => onDeleteTicket(ticket._id)}
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
  );
}