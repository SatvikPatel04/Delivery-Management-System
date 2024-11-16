import React from 'react';
import { Link } from 'react-router-dom';
import './CustomerDashboard.css';
import Navbar from '../../Components/Navbar/Navbar';

function CustomerDashboard() {
  const handleCancelOrder = () => {
    // Implement the logic to cancel the order here
    alert("Order has been canceled."); // Placeholder action
  };

  return (
    <div className="cust-dashboard">
      <Navbar />
      <h2>Customer Dashboard</h2>
      <div className="dashboard-options">
        <Link to="/place-order" className="dashboard-button">
          Place Order
        </Link>
        <Link to="/track-order" className="dashboard-button">
          Track Order
        </Link>
        <Link to="/view-my-orders" className="dashboard-button">
          View My Orders
        </Link>
        <Link to="/update-user" className="dashboard-button">
          Update User Information
        </Link>
      </div>
    </div>
  );
}

export default CustomerDashboard;
