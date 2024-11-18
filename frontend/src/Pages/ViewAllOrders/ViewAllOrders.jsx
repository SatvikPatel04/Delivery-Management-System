import React, { useState, useEffect } from 'react';
import './ViewAllOrders.css';
import NavbarAdmin from '../../Components/Navbar/NavbarAdmin';
function ViewAllOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/all-orders')
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Orders Data:", data); 
        setOrders(data);
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  return (
    <div className="view-orders-container">
      <NavbarAdmin />
      <h2>All Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Delivery Partner</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Order Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan="7">No orders available</td></tr>
          ) : (
            orders.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{order.OrderID}</td>
                <td>{order.UserID}</td>
                <td>{order.DeliveryPartnerName || 'N/A'}</td>
                <td>{order.Amount}</td>
                <td className={`status ${order.OrderStatus.toLowerCase().replace(/\s/g, '-')}`}>
                  {order.OrderStatus}
                </td>
                <td>{new Date(order.OrderTime).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewAllOrders;
