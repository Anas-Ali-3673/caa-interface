'use client';

import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminHeader from './components/AdminHeader';
import ErrorDisplay from './components/ErrorDisplay';
import DatabaseControl from './components/DatabaseControl';
import AuditLogs from './components/AuditLogs';
import SecuritySummary from './components/SecuritySummary';
import { useAdminData } from './hooks/useAdminData';

export default function AdminPanel() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { auditLogs, loading, error, databaseStatus, toggleDatabase, setError } = useAdminData(token, user?.role);

  // Redirect if not admin
  useEffect(() => {
    if (!user || !token) {
      router.push('/sign-in');
      return;
    }
    
    if (user.role !== 'Admin' && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [user, token, router]);

  if (!user || (user.role !== 'Admin' && user.role !== 'admin')) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Access denied. Admin only.</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userEmail={user.email} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorDisplay error={error} onDismiss={() => setError(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <DatabaseControl 
              loading={loading}
              databaseStatus={databaseStatus}
              onToggleDatabase={toggleDatabase}
            />
          </div>

          <div className="lg:col-span-2">
            <AuditLogs auditLogs={auditLogs} />
          </div>
        </div>

        <div className="mt-8">
          <SecuritySummary />
        </div>
      </main>
    </div>
  );
}