import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaUserTie } from "react-icons/fa";
import { auth, db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import TITLE from "../components/common/Title";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSelectRole = async (role) => {
    if (loading) return; // Prevent multiple clicks while loading
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { role });

      navigate(role === "jobseeker" ? "/setup-seeker" : "/setup-employer");
    } catch (err) {
      console.error("Error selecting role:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-blue-700 via-blue-900 to-gray-600 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">
          Choose Your Preferred Role
        </h2>
        <p className="text-lg text-gray-300 mb-12">
          Let us know how you'd like to use <span className="text-white">{TITLE}</span>.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Job Seeker Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !loading && handleSelectRole("jobseeker")}
            className={`role-card bg-white/10 border border-white rounded-lg p-6 cursor-pointer transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-white/20 hover:border-yellow-400"
            }`}
          >
            <FaUserTie className="text-5xl text-yellow-300 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">I'm a Job Seeker</h3>
            <p>Find and apply for the best job opportunities that match your skills, passion, and experience.</p>
          </motion.div>

          {/* Employer Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !loading && handleSelectRole("employer")}
            className={`role-card bg-white/10 border border-white rounded-lg p-6 cursor-pointer transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-white/20 hover:border-yellow-400"
            }`}
          >
            <FaBriefcase className="text-5xl text-yellow-300 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">I'm an Employer</h3>
            <p>Post jobs, manage applications, and find the perfect candidate for your team.</p>
          </motion.div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-gray-300"
            >
              ⏳ Processing...
            </motion.div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-6 text-gray-400 hover:text-white transition"
        >
          ⬅ Go Back
        </button>
      </motion.div>
    </section>
  );
};

export default RoleSelection;
