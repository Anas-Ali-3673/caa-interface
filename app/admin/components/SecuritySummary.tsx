'use client';

export default function SecuritySummary() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
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
  );
}