import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateDetails.css';
import Navbar from '../../Components/Navbar/Navbar';

const UpdateDetails = () => {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(''); // Error state for password validation
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Validate password
        if (value.length < 6) {
            setError('Password must be at least 6 characters long.');
        } else if (!/\d/.test(value)) {
            setError('Password must contain at least one number.');
        } else {
            setError(''); // Clear error if validation passes
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Block form submission if there is a validation error
        if (error) {
            setMessage('Please fix the errors before submitting the form.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/update-user-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: password,
                    address: address,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('User details updated successfully!');
                navigate('/customer-dashboard');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('Error updating user details. Please try again.');
        }
    };

    return (
        <div className="update-details-container">
            <Navbar />
            <h1>Update User Details</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                {error && <p style={{ color: 'red', fontSize: '0.9em' }}>{error}</p>}
                <textarea
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                ></textarea>
                <button type="submit" disabled={!!error}>Update</button>
            </form>
            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
    );
};

export default UpdateDetails;
