import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddDeliveryPartner.css';
import NavbarAdmin from '../../Components/Navbar/NavbarAdmin';

const AddDeliveryPartner = () => {
  const [partnerDetails, setPartnerDetails] = useState({
    name: '',
    phoneNumber: '',
    vehicleType: 'petroleum',
    vehicleCapacity: 2,
    maintenanceSchedule: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartnerDetails({ ...partnerDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Sending partner data:', partnerDetails);

      const response = await fetch('http://localhost:5001/add-delivery-partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerDetails)
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add delivery partner');
      }

      alert('Delivery partner added successfully!');
      navigate('/admin-dashboard');
      
    } catch (error) {
      console.error('Error adding delivery partner:', error);
      alert(error.message || 'Failed to add delivery partner. Please try again.');
    }
  };

  return (
    <div className="add-partner-container">
      <NavbarAdmin />
      <h2>Add Delivery Partner</h2>
      <form onSubmit={handleSubmit} className="add-partner-form">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={partnerDetails.name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={partnerDetails.phoneNumber}
          onChange={handleChange}
          placeholder="Enter 10-digit phone number"
          pattern="^[0-9]{10}$"
          required
        />

        <label>Vehicle Type</label>
        <select
          name="vehicleType"
          value={partnerDetails.vehicleType}
          onChange={handleChange}
          required
        >
          <option value="petroleum">Petroleum</option>
          <option value="cng">CNG</option>
          <option value="electric">Electric</option>
        </select>

        <label>Vehicle Capacity</label>
        <input
          type="number"
          name="vehicleCapacity"
          value={partnerDetails.vehicleCapacity}
          onChange={handleChange}
          placeholder="Enter capacity (2-10)"
          min="2"
          max="10"
          required
        />

        <label>Maintenance Schedule</label>
        <input
          type="date"
          name="maintenanceSchedule"
          value={partnerDetails.maintenanceSchedule}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Partner</button>
      </form>
    </div>
  );
};

export default AddDeliveryPartner;
