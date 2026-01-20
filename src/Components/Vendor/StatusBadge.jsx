import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case 'all good':
      case 'live':
      case 'paid':
      case 'compliant':
      case 'enabled':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'needs attention':
      case 'pending':
      case 'under review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'issue detected':
      case 'action required':
      case 'disabled':
      case 'draft':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
