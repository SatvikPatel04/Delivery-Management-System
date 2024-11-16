import React, { useState } from 'react';
import './RemoveDP.css';
import NavbarAdmin from '../../Components/Navbar/NavbarAdmin';

function RemoveDP()  {
    const [partnerID, setPartnerID] = useState('');
    const [message, setMessage] = useState('');

    const handleRemovePartner = async () => {
        try {
            const response = await fetch('http://localhost:5001/remove-dp', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ partnerID: parseInt(partnerID) }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(result.message);
            } else {
                setMessage(result.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to remove delivery partner.');
        }
    };

    return (
        <div className="remove-partner-container">
            <NavbarAdmin />
            <h2>Remove Delivery Partner</h2>
            <input
                type="number"
                placeholder="Enter Delivery Partner ID"
                value={partnerID}
                onChange={(e) => setPartnerID(e.target.value)}
            />
            <button onClick={handleRemovePartner}>Remove Partner</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default RemoveDP;
