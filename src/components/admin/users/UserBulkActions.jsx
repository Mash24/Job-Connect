import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trash2, Send, Users, X } from 'lucide-react';

const UserBulkActions = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleAction = (action) => {
    setPendingAction(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (pendingAction) {
      onBulkAction(pendingAction);
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const getActionConfig = (action) => {
    switch (action) {
      case 'approve':
        return {
          label: 'Approve Users',
          icon: CheckCircle,
          color: 'green',
          description: 'Activate selected users'
        };
      case 'deactivate':
        return {
          label: 'Deactivate Users',
          icon: XCircle,
          color: 'yellow',
          description: 'Deactivate selected users'
        };
      case 'delete':
        return {
          label: 'Delete Users',
          icon: Trash2,
          color: 'red',
          description: 'Permanently delete selected users'
        };
      case 'message':
        return {
          label: 'Send Message',
          icon: Send,
          color: 'blue',
          description: 'Send message to selected users'
        };
      default:
        return {
          label: 'Action',
          icon: Users,
          color: 'gray',
          description: 'Perform action on selected users'
        };
    }
  };

  const actionConfig = pendingAction ? getActionConfig(pendingAction) : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">
                {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={onClearSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('approve')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => handleAction('deactivate')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200"
            >
              <XCircle className="w-4 h-4" />
              Deactivate
            </button>
            <button
              onClick={() => handleAction('message')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200"
            >
              <Send className="w-4 h-4" />
              Message
            </button>
            <button
              onClick={() => handleAction('delete')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && actionConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowConfirmDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-96 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full bg-${actionConfig.color}-100`}>
                  <actionConfig.icon className={`w-6 h-6 text-${actionConfig.color}-600`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {actionConfig.label}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {actionConfig.description}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  Are you sure you want to {actionConfig.label.toLowerCase()} 
                  <span className="font-medium"> {selectedCount} user{selectedCount !== 1 ? 's' : ''}</span>?
                </p>
                {pendingAction === 'delete' && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ This action cannot be undone.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`flex-1 px-4 py-2 text-white bg-${actionConfig.color}-600 hover:bg-${actionConfig.color}-700 rounded-lg`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserBulkActions; 