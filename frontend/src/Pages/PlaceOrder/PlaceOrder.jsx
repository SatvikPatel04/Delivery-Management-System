import React, { useState, useEffect } from 'react';
import './PlaceOrder.css';
import Navbar from '../../Components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

function PlaceOrder() {
  const [startHouseName, setStartHouseName] = useState('');
  const [startStreet, setStartStreet] = useState('');
  const [startCity, setStartCity] = useState('');
  const [startPincode, setStartPincode] = useState('');
  const [deliveryHouseName, setDeliveryHouseName] = useState('');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [distance, setDistance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('userID')) {
      localStorage.setItem('userID', '1');
    }
  }, []);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const userID = localStorage.getItem('userID');
      if (!userID) {
        throw new Error('Please login first');
      }

      const pickUpLocation = `${startHouseName}, ${startStreet}, ${startCity}, ${startPincode}`;
      const dropOffLocation = `${deliveryHouseName}, ${deliveryStreet}, ${deliveryCity}, ${deliveryPincode}`;
      
      console.log('Sending data with userID:', userID);

      const response = await fetch('http://localhost:5001/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickUpLocation,
          dropOffLocation,
          userID: parseInt(userID),
          distance
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      alert('Order placed successfully!');
      navigate('/customer-dashboard')
      
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message);
    }
  };

  const resetForm = () => {
    setStartHouseName('');
    setStartStreet('');
    setStartCity('');
    setStartPincode('');
    setDeliveryHouseName('');
    setDeliveryStreet('');
    setDeliveryCity('');
    setDeliveryPincode('');
    setDistance('');
  };

  return (
    <div className="order-page">
      <Navbar />
      <h2>Place Your Order</h2>
      <form onSubmit={handleOrderSubmit} className="order-form">
        {error && <div className="error-message">{error}</div>}

        <h3>Start Location</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start-house-name">Building/Store Name</label>
            <input
              type="text"
              id="start-house-name"
              value={startHouseName}
              onChange={(e) => setStartHouseName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="start-street">Street</label>
            <input
              type="text"
              id="start-street"
              value={startStreet}
              onChange={(e) => setStartStreet(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start-city">City</label>
            <input
              type="text"
              id="start-city"
              value={startCity}
              onChange={(e) => setStartCity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="start-pincode">Pincode</label>
            <input
              type="text"
              id="start-pincode"
              value={startPincode}
              onChange={(e) => setStartPincode(e.target.value)}
              required
            />
          </div>
        </div>

        <h3>Delivery Location</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="delivery-house-name">Building Name</label>
            <input
              type="text"
              id="delivery-house-name"
              value={deliveryHouseName}
              onChange={(e) => setDeliveryHouseName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="delivery-street">Street</label>
            <input
              type="text"
              id="delivery-street"
              value={deliveryStreet}
              onChange={(e) => setDeliveryStreet(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="delivery-city">City</label>
            <input
              type="text"
              id="delivery-city"
              value={deliveryCity}
              onChange={(e) => setDeliveryCity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="delivery-pincode">Pincode</label>
            <input
              type="text"
              id="delivery-pincode"
              value={deliveryPincode}
              onChange={(e) => setDeliveryPincode(e.target.value)}
              required
            />
          </div>
        </div>

        <label htmlFor="distance">Approximate Distance (km)</label>
        <input
          type="number"
          id="distance"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          required
          min="0"
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Placing Order...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
}

export default PlaceOrder;