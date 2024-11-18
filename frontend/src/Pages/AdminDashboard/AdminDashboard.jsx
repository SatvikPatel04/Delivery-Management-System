import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import NavbarAdmin from '../../Components/Navbar/NavbarAdmin';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <NavbarAdmin />
      <h2>Admin Dashboard</h2>
      <div className="dashboard-options">
        <Link to="/add-delivery-partner" className="dashboard-button">
          Add Delivery Partner
        </Link>
        <Link to="/view-delivery-partners" className="dashboard-button">
          View Delivery Partners
        </Link>
        <Link to="/view-all-orders" className="dashboard-button">
          View All Orders
        </Link>
        <Link to="/remove-dp" className="dashboard-button">
          Remove Delivery Partner
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
