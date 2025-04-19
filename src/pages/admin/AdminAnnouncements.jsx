import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
  doc,
} from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { Megaphone, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [visibleTo, setVisibleTo] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(auth.currentUser);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sorted = data
        .filter((a) => {
          const ageInDays = (Date.now() / 1000 - a.timestamp?.seconds) / (60 * 60 * 24);
          return ageInDays < 30; // show only last 30 days
        })
        .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
      setAnnouncements(sorted);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'announcements'), {
        message: message.trim(),
        createdBy: auth.currentUser?.email || 'admin',
        visibleTo,
        timestamp: serverTimestamp(),
      });
      toast.success('📢 Announcement posted successfully');
      setMessage('');
    } catch (err) {
      console.error('Error posting announcement:', err);
      toast.error('❌ Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteDoc(doc(db, 'announcements', id));
      toast.success('🗑️ Announcement deleted');
    } catch (err) {
      console.error('Error deleting announcement:', err);
      toast.error('❌ Failed to delete announcement');
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (a.visibleTo === 'all') return true;
    if (!currentUser) return false;
    if (a.visibleTo === 'admin' && currentUser.email.includes('admin')) return true;
    if (a.visibleTo === 'job-seeker' && currentUser.email.includes('seeker')) return true;
    if (a.visibleTo === 'employer' && currentUser.email.includes('employer')) return true;
    return false;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
          <Megaphone className="text-blue-600" /> Admin Announcements
        </h2>

        {/* Post Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-8 border space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your announcement here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
            rows={4}
          />

          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-700">Visible To:</label>
            <select
              value={visibleTo}
              onChange={(e) => setVisibleTo(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="job-seeker">Job Seekers</option>
              <option value="employer">Employers</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>

        {/* Announcement Feed */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center text-sm text-gray-500 italic">No announcements found.</div>
          ) : (
            filteredAnnouncements.map((a) => (
              <div
                key={a.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200"
              >
                <p className="text-gray-800 leading-relaxed">{a.message}</p>
                <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                  <span>
                    Posted by <span className="font-medium text-gray-700">{a.createdBy}</span>
                    {' '}<span className="text-gray-400 italic">({a.visibleTo})</span>
                  </span>
                  <div className="flex gap-2 items-center">
                    <span>
                      {a.timestamp?.seconds && new Date(a.timestamp.seconds * 1000).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
