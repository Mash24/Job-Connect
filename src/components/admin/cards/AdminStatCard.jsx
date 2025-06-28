import React from 'react';
import CountUp from 'react-countup';

const AdminStatCard = ({ title, value, icon, color = 'from-blue-500 to-indigo-500' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-tr ${color} rounded-xl shadow-lg p-6 flex items-center gap-4 transition-transform duration-200 cursor-pointer min-h-[110px]`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-4xl text-white drop-shadow-lg">{icon}</div>
      <div>
        <p className="text-sm text-white/80 font-medium mb-1">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-white">
          <CountUp end={value} duration={1.2} separator="," />
        </p>
      </div>
    </motion.div>
  );
};

export default AdminStatCard; 