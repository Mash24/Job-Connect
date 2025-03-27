import React from 'react';

const BackgroundWrapper = ({ children }) => {
  return (
    <div
        className="w-full h-screen bg-cover bg-center bg-no-repeat flex flex-col overflow-hidden"
         style={{ backgroundImage: "url('/images/sign_up.jpg')" }}
    >

      {children}
    </div>
  );
};

export default BackgroundWrapper;
