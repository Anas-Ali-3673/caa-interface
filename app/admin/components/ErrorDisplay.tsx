'use client';

interface ErrorDisplayProps {
  error: string | null;
  onDismiss: () => void;
}

export default function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
      <p className="text-red-800">{error}</p>
      <button 
        onClick={onDismiss}
        className="mt-2 text-sm text-red-600 hover:text-red-800"
      >
        Dismiss
      </button>
    </div>
  );
}