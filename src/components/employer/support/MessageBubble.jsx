// File: /src/components/employer/support/MessageBubble.jsx

import React from 'react';
import { format } from 'date-fns';
import { FaUserTie, FaRobot } from 'react-icons/fa';

const MessageBubble = ({ message, currentUserId }) => {
  const isUser = message.userId === currentUserId;
  const { text, createdAt } = message;

  const bubbleStyle = isUser
    ? 'bg-blue-600 text-white self-end rounded-tl-2xl rounded-bl-2xl rounded-br-md'
    : 'bg-gray-200 text-gray-800 self-start rounded-tr-2xl rounded-br-2xl rounded-bl-md';

  const avatar = isUser ? (
    <FaUserTie className="text-blue-600 text-xl" title="You" />
  ) : (
    <FaRobot className="text-gray-400 text-xl" title="Support" />
  );

  return (
    <div
      className={`flex items-end gap-2 mb-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && <div className="p-1">{avatar}</div>}

      <div
        className={`max-w-xs md:max-w-md p-3 text-sm shadow ${bubbleStyle}`}
      >
        <p className="whitespace-pre-line">{text}</p>
        {createdAt?.seconds && (
          <p className="mt-1 text-[11px] opacity-70 text-right">
            {format(new Date(createdAt.seconds * 1000), 'MMM d, h:mm a')}
          </p>
        )}
      </div>

      {isUser && <div className="p-1">{avatar}</div>}
    </div>
  );
};

export default MessageBubble;
