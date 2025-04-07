import React from 'react';
import { FaHeadset } from 'react-icons/fa';

const SupportHeader = () => {
  return (
    <header className="bg-blue-500 text-white px-6 py-4 shadow-md flex flex-col md:flex-row md:items-center md:justify-between rounded-b-lg">
      <div className="flex items-center gap-3">
        <FaHeadset className="text-2xl text-white" />
        <div>
          <h1 className="text-lg md:text-xl font-semibold">Live Support</h1>
          <p className="text-sm text-blue-100">We're here to help anytime.</p>
        </div>
      </div>
      <div className="mt-3 md:mt-0 text-sm text-blue-100 text-right">
        Available <span className="font-semibold text-white">24/7</span>
      </div>
    </header>
  );
};

export default SupportHeader;