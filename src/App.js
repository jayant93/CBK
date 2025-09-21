import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddLinks from './components/AddLinks';
import PublicProfile from './components/PublicProfile';

export default function App() {
  return (
    <div className="container">
      <div className="brand">🚀 CKB — Check Karo Badshaho 👑</div>
      <Routes>
        <Route path="/" element={<AddLinks />} />
        <Route path="/u/:phone" element={<PublicProfile />} />
      </Routes>
    </div>
  );
}
