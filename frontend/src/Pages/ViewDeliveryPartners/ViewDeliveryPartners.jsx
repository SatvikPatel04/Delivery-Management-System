import React, { useState, useEffect } from 'react';
import './ViewDeliveryPartners.css';
import NavbarAdmin from '../../Components/Navbar/NavbarAdmin';

function ViewDeliveryPartners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('http://localhost:5001/delivery-partners');
        if (!response.ok) {
          throw new Error('Failed to fetch delivery partner details');
        }
        const data = await response.json();
        console.log(data);
        
        setPartners(data[0]);
      } catch (error) {
        console.error('Error fetching delivery partners:', error);
      }
    };

    fetchPartners();
  }, []);
  
console.log(partners);

  return (
    <div className="view-partners-container">
      <NavbarAdmin />
      <h2>Delivery Partners</h2>
      <table className="partners-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Delivery Partner ID</th> {/* Add column for Delivery Partner ID */}
            <th>Name</th>
            <th>Phone Number</th>
            <th>Vehicle Number</th>
            <th>Vehicle Type</th>
            <th>Vehicle Capacity</th>
            <th>Maintenance Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {partners.length === 0 ? (
            <tr><td colSpan="9">No data available</td></tr> 
          ) : (
            partners.map((partner, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{partner.Delivery_partnerID}</td> {/* Display Delivery Partner ID */}
                <td>{partner.Name}</td>
                <td>{partner.PhoneNumber}</td>
                <td>{partner.VehicleID}</td>
                <td>{partner.VehicleType || 'Unknown'}</td>
                <td>{partner.VehicleCapacity || 'N/A'}</td>
                <td>{partner.MaintenanceSchedule || 'N/A'}</td>
                <td className={`status ${partner.Status.toLowerCase()}`}>
                  {partner.Status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewDeliveryPartners;
