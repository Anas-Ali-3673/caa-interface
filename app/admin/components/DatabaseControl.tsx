'use client';

interface DatabaseStatus {
  primaryDown: boolean;
}

interface DatabaseControlProps {
  loading: boolean;
  databaseStatus: DatabaseStatus | null;
  onToggleDatabase: () => void;
}

export default function DatabaseControl({ loading, databaseStatus, onToggleDatabase }: DatabaseControlProps) {
  return (
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
            onClick={onToggleDatabase}
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
  );
}