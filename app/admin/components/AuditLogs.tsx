'use client';

import { useState, useMemo } from 'react';

interface AuditLog {
  _id: string;
  userId: string | { _id: string; name?: string; email: string };
  action: string;
  details: any;
  timestamp: string;
  userRole: string;
}

interface AuditLogsProps {
  auditLogs: AuditLog[];
}

const LOGS_PER_PAGE = 2;

export default function AuditLogs({ auditLogs }: AuditLogsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(auditLogs.length / LOGS_PER_PAGE);
  
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
    const endIndex = startIndex + LOGS_PER_PAGE;
    return auditLogs.slice(startIndex, endIndex);
  }, [auditLogs, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  return (
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
          <>
            <div className="space-y-4">
              {paginatedLogs.map((log) => (
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
                      <strong>User:</strong> {typeof log.userId === 'string' ? log.userId : (log.userId.name || log.userId.email)}
                    </div>
                    
                    {log.details && typeof log.details === 'object' && (
                      <div className="mt-2">
                        <strong className="text-sm text-gray-700">Details:</strong>
                        <pre className="mt-1 text-xs bg-gray-50 text-gray-600 p-2 rounded overflow-x-auto">
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

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * LOGS_PER_PAGE) + 1} to {Math.min(currentPage * LOGS_PER_PAGE, auditLogs.length)} of {auditLogs.length} logs
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 text-sm border rounded ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}