'use client';

import { useState, useEffect } from 'react';

interface AuditLog {
  _id: string;
  userId: string;
  action: string;
  details: any;
  timestamp: string;
  userRole: string;
}

interface DatabaseStatus {
  primaryDown: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function useAdminData(token: string | null, userRole: string | undefined) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus | null>(null);

  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      if (!token || userRole !== 'Admin') return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/audit/logs`, {
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
  }, [token, userRole]);

  // Fetch database status
  useEffect(() => {
    const fetchDatabaseStatus = async () => {
      if (!token || userRole !== 'Admin') return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/audit/database/status`, {
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
  }, [token, userRole]);

  const toggleDatabase = async () => {
    if (!token || !databaseStatus) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit/database/toggle`, {
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

  return {
    auditLogs,
    loading,
    error,
    databaseStatus,
    toggleDatabase,
    setError
  };
}