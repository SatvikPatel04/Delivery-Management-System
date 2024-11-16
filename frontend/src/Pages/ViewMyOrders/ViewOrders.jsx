// ViewOrders.jsx
import React, { useState, useEffect } from 'react';
import './ViewOrders.css';
import Navbar from '../../Components/Navbar/Navbar';

function ViewOrders({ userId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders for the specified user ID from the backend API
    fetch('http://localhost:5001/view-orders')
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Orders Data:", data); // Log data to verify response
        setOrders(data);
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }, [userId]);

  return (
    <div className="view-orders-container">
      <Navbar />
      <h2>Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Order ID</th>
            <th>Delivery Partner</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Order Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan="6">No orders available</td></tr>
          ) : (
            orders.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{order.OrderID}</td>
                <td>{order.DeliveryPartnerName || 'N/A'}</td>
                <td>{order.Amount}</td>
                <td className={`status ${order.OrderStatus.toLowerCase().replace(/\s/g, '-')}`}>
                    {order.OrderStatus}
</td>

                <td>{order.OrderTime}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewOrders;
