// File: /src/components/employer/support/SupportMessageList.jsx

import React from 'react';
import MessageBubble from './MessageBubble';

const SupportMessageList = ({ messages, loading, chatRef, currentUserId }) => {
  console.log("Rendering messages for UID:", currentUserId, messages);

  return (
    <div
      ref={chatRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-2 bg-white"
      style={{ scrollBehavior: 'smooth' }}
    >
      {loading ? (
        <p className="text-center text-gray-500">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-400 italic">
          No messages yet. Feel free to say hello! 👋
        </p>
      ) : (
        messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            currentUserId={currentUserId}
          />
        ))
      )}
    </div>
  );
};

export default SupportMessageList;