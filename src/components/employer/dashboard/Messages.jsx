// File: /src/components/employer/dashboard/Messages.jsx

import React, { useState } from 'react';
import { MessageSquare, Search, Send } from 'lucide-react';
import clsx from 'clsx';

const dummyMessages = [
  {
    id: 1,
    name: 'Jane Kimani',
    lastMessage: 'Hi, I’m interested in the frontend role.',
    timestamp: '2 min ago',
    online: true,
  },
  {
    id: 2,
    name: 'Brian Otieno',
    lastMessage: 'Can we schedule a quick call?',
    timestamp: '10 min ago',
    online: false,
  },
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState('');

  const filteredMessages = dummyMessages.filter((msg) =>
    msg.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto p-4">
      {/* Sidebar - Conversations */}
      <div className="bg-white rounded-xl shadow-md p-4 h-[75vh] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4 overflow-y-auto space-y-2 flex-1">
          {filteredMessages.length === 0 ? (
            <p className="text-gray-500 text-sm">No conversations found.</p>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedChat(msg)}
                className={clsx(
                  'cursor-pointer p-3 rounded-lg transition hover:bg-blue-50',
                  selectedChat?.id === msg.id && 'bg-blue-100'
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-gray-800">{msg.name}</div>
                  <span
                    className={clsx(
                      'w-2.5 h-2.5 rounded-full',
                      msg.online ? 'bg-green-500' : 'bg-gray-300'
                    )}
                    title={msg.online ? 'Online' : 'Offline'}
                  />
                </div>
                <p className="text-sm text-gray-500 truncate">{msg.lastMessage}</p>
                <p className="text-xs text-gray-400">{msg.timestamp}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6 h-[75vh] flex flex-col">
        {!selectedChat ? (
          <div className="text-gray-500 flex-1 flex items-center justify-center">
            Select a conversation to view messages.
          </div>
        ) : (
          <>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{selectedChat.name}</h3>
              <p className="text-sm text-gray-500">Conversation with {selectedChat.name}</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-sm">
              <div className="self-start bg-gray-100 px-3 py-2 rounded-lg w-fit">
                Hi, I saw your job post for React dev.
              </div>
              <div className="self-end bg-blue-100 px-3 py-2 rounded-lg w-fit">
                Great! Please share your portfolio.
              </div>
              {/* Add message loop here when you connect with Firestore */}
            </div>

            <div className="flex items-center mt-4 gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full text-sm focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
