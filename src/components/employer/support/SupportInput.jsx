// File: /src/components/employer/support/SupportInput.jsx

import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import { FaPaperPlane } from 'react-icons/fa';

const SupportInput = () => {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const user = auth.currentUser;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    setSending(true);

    try {
      await addDoc(collection(db, 'support'), {
        userId: user.uid,
        email: user.email,
        text: input.trim(),
        createdAt: serverTimestamp(),
        from: 'user'
      });
      setInput('');
    } catch (error) {
      console.error('🚨 Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="sticky bottom-0 bg-white p-4 flex items-center border-t gap-3"
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={sending}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={sending}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full disabled:opacity-50"
        aria-label="Send message"
      >
        <FaPaperPlane />
      </button>
    </form>
  );
};

export default SupportInput;
