import React, { useState } from 'react';
import './TrackOrder.css';
import Navbar from '../../Components/Navbar/Navbar';

function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setOrderId(e.target.value);
  };

  const trackOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5001/order-status?orderId=${orderId}`);
      console.log(response.json)
      if (!response.ok) {
        throw new Error('Order not found');
      }
      const data = await response.json();
      setOrderDetails(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setOrderDetails(null);
    }
  };

  return (
    <div className="track-order-container">
      <Navbar />
      <h2>Track Your Order</h2>

      <div className="order-input">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={handleInputChange}
        />
        <button onClick={trackOrder}>Track Order</button>
      </div>

      {error && <p className="error">{error}</p>}

      {orderDetails && (
        <div className="order-info">
          <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
          <p><strong>Total Amount:</strong> ${orderDetails.totalAmount}</p>
          <h3>Current Status: {orderDetails.currentStatus}</h3>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
