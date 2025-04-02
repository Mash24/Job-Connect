import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/layouts/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact';
import Home from './pages/Home';

import RoleSelection from './pages/RoleSelection';
import SetupSeeker from './pages/SetupSeeker'

function App() {

  return (
    <>
        <Navbar /> {/* navbar appears on every route */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/select-role" element={<RoleSelection />} />
            <Route path="/setup-seeker" element={<SetupSeeker />} />
          </Routes>
    </>
  );
}

export default App;