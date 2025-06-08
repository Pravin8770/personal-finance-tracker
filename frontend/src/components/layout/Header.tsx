import React from 'react';
import './Header.css';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header-logo">
        <h1>Finance Tracker</h1>
      </div>
      <nav className="header-nav">
        <button className="header-button" onClick={logout}>Logout</button>
      </nav>
    </header>
  );
};

export default Header;
