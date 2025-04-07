// File: /src/components/employer/support/Support.jsx

import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../../../firebase/config';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

import SupportHeader from './SupportHeader';
import SupportMessageList from './SupportMessageList';
import SupportInput from './SupportInput';

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'support'),
      where('userId', '==', user.uid),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filtered = snapshot.docs
        .filter(doc => doc.data().createdAt) // prevent loading null timestamps
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

      setMessages(filtered);
      setLoading(false);

      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || !user) return;

    try {
      await addDoc(collection(db, 'support'), {
        userId: user.uid,
        email: user.email,
        text: text.trim(),
        createdAt: serverTimestamp(),
        from: 'user'
      });
    } catch (err) {
      console.error('❌ Failed to send message:', err.message);
      alert('Failed to send. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <SupportHeader />
      <SupportMessageList
        messages={messages}
        currentUserId={user?.uid}
        loading={loading}
        chatRef={chatRef}
      />
      <SupportInput onSend={handleSendMessage} />
    </div>
  );
};

export default Support;
