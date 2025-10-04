'use client';

import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  userEmail: string;
}

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  const router = useRouter();

  return (
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
              {userEmail}
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
              ADMIN
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}