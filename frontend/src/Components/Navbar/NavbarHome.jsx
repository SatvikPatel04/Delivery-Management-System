import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function NavbarHome() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5001/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error('Failed to log out');
      }
  
      console.log('Logout successful');
      navigate('/'); // Redirect to the home page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">DeliveryApp</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
      </ul>
      <button className="navbar-logout" onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default NavbarHome;
