'use client';

import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  email: string;
  role: string;
}

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const router = useRouter();

  return (
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
            
            {(user.role === 'Admin' || user.role === 'admin') && (
              <button
                onClick={() => router.push('/admin')}
                className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Admin Panel
              </button>
            )}
            
            <button
              onClick={onLogout}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}