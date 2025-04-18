import React from 'react';
import { Eye } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const ReportCard = ({ report, onView }) => {
  const {
    type,
    reason,
    status = 'pending',
    timestamp,
  } = report;

  const formattedTime = timestamp?.toDate
    ? new Date(timestamp.toDate()).toLocaleString()
    : 'Unknown time';

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800 capitalize">
            🧾 {type || 'Unknown Type'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{reason || 'No reason provided.'}</p>
          <p className="text-xs text-gray-400 mt-2">📅 {formattedTime}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={status} />
          <button
            onClick={onView}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <Eye size={16} /> View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
