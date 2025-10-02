'use client';

import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuditLog {
  _id: string;
  userId: string;
  action: string;
  details: any;
  timestamp: string;
  userRole: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminPanel() {
  const { user, token } = useAuth();
  const router = useRouter();
  
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<{ primaryDown: boolean } | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!user || !token) {
      router.push('/sign-in');
      return;
    }
    
    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [user, token, router]);

  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      if (!token || user?.role !== 'admin') return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/audit/logs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch audit logs');
        }

        const data = await response.json();
        setAuditLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch audit logs');
      }
    };

    fetchAuditLogs();
  }, [token, user]);

  // Fetch database status
  useEffect(() => {
    const fetchDatabaseStatus = async () => {
      if (!token || user?.role !== 'admin') return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/audit/database/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch database status');
        }

        const data = await response.json();
        setDatabaseStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch database status');
      } finally {
        setLoading(false);
      }
    };

    fetchDatabaseStatus();
  }, [token, user]);

  const toggleDatabase = async () => {
    if (!token || !databaseStatus) return;

    try {
      const response = await fetch(`${API_BASE_URL}/audit/database/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ down: !databaseStatus.primaryDown }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle database');
      }

      setDatabaseStatus(prev => prev ? { primaryDown: !prev.primaryDown } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle database');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Access denied. Admin only.</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Panel
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                ADMIN
              </span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Database Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Database Availability Control
              </h2>
              
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : databaseStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Primary Database Status:
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      databaseStatus.primaryDown 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {databaseStatus.primaryDown ? 'DOWN' : 'UP'}
                    </span>
                  </div>
                  
                  <button
                    onClick={toggleDatabase}
                    className={`w-full px-4 py-2 rounded-md font-medium ${
                      databaseStatus.primaryDown
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {databaseStatus.primaryDown ? 'Restore Primary DB' : 'Simulate DB Failure'}
                  </button>
                  
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <p className="font-medium mb-1">How it works:</p>
                    <p>
                      When primary database is down, the application automatically 
                      switches to the secondary database for all operations, 
                      demonstrating high availability.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Unable to load database status
                </div>
              )}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Audit Logs (Accountability)
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Complete audit trail of all user actions for security accountability
                </p>
              </div>
              
              <div className="p-6">
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No audit logs found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auditLogs.map((log) => (
                      <div key={log._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-900">
                                {log.action}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                log.userRole === 'admin' 
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {log.userRole}
                              </span>
                            </div>
                            
                            <div className="mt-2 text-sm text-gray-600">
                              <strong>User ID:</strong> {log.userId}
                            </div>
                            
                            {log.details && (
                              <div className="mt-2">
                                <strong className="text-sm text-gray-700">Details:</strong>
                                <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-4 text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Features Summary */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Security Features Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Confidentiality</h3>
              <p className="text-sm text-gray-600 mt-1">
                Role-based access control ensures users can only see and modify their own tickets. 
                Admins have full access to all data.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Availability</h3>
              <p className="text-sm text-gray-600 mt-1">
                Dual database setup with automatic failover. System continues operating 
                even when primary database is down.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Accountability</h3>
              <p className="text-sm text-gray-600 mt-1">
                Complete audit trail of all user actions with timestamps, 
                user identification, and action details.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}