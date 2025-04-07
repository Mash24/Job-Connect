// File: /src/components/admin/support/SupportThread.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';
import MessageBubble from '../../employer/support/MessageBubble';
import { FaPaperPlane, FaImage } from 'react-icons/fa';

const SupportThreadPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [ticketStatus, setTicketStatus] = useState('pending');
  const chatRef = useRef(null);

  // Load messages
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'support'),
      where('userId', '==', userId),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => doc.data());
      setMessages(list);

      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    });

    return () => unsubscribe();
  }, [userId]);

  // Load user info and ticket status
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setUserProfile(snap.data());
      }
    };

    const fetchThreadStatus = async () => {
      const threadRef = doc(db, 'supportThreads', userId);
      const snap = await getDoc(threadRef);
      if (snap.exists()) {
        setTicketStatus(snap.data().status || 'pending');
      } else {
        await setDoc(threadRef, {
          status: 'pending',
          userId
        });
      }
    };

    fetchUserProfile();
    fetchThreadStatus();
  }, [userId]);

  // Handle admin reply
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !file) || !userId) return;
    setSending(true);

    try {
      let imageUrl = null;
      if (file) {
        const storageRef = ref(storage, `support/${userId}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'support'), {
        userId,
        email: userProfile?.email || 'admin@chat.com',
        text: input.trim(),
        imageUrl: imageUrl || null,
        from: 'admin',
        createdAt: serverTimestamp()
      });

      await updateDoc(doc(db, 'supportThreads', userId), {
        status: 'answered'
      });

      setInput('');
      setFile(null);
      setTicketStatus('answered');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  // Handle ticket status change
  const handleStatusChange = async (newStatus) => {
    try {
      await updateDoc(doc(db, 'supportThreads', userId), {
        status: newStatus
      });
      setTicketStatus(newStatus);
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md border flex flex-col h-[85vh]">
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${userProfile?.firstname || 'User'}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{userProfile?.firstname || 'Unknown User'}</p>
              <p className="text-sm text-gray-500">{userProfile?.email || 'No email found'}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mr-2">Status:</label>
            <select
              value={ticketStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="pending">🟠 Pending</option>
              <option value="answered">🟢 Answered</option>
              <option value="resolved">✅ Resolved</option>
            </select>
          </div>
        </div>

        {/* Message list */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white"
        >
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">No messages yet.</p>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg}
                currentUserId={userId}
              />
            ))
          )}
        </div>

        {/* Admin Reply Input */}
        <form onSubmit={handleSend} className="border-t p-4 flex flex-col gap-2 bg-white">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="admin-upload"
            />
            <label
              htmlFor="admin-upload"
              className="cursor-pointer text-gray-500 hover:text-blue-600"
              title="Upload image"
            >
              <FaImage className="text-xl" />
            </label>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:ring-2 focus:ring-blue-500"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
            >
              <FaPaperPlane />
            </button>
          </div>

          {file && (
            <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {file.name}
              </span>
              <button
                onClick={() => setFile(null)}
                type="button"
                className="text-xs text-red-500 underline"
              >
                Remove
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SupportThreadPage;
