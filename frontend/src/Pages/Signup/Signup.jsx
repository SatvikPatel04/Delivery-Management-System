import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import NavbarHome from '../../Components/Navbar/NavbarHome';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    address: '',
  });

  const [error, setError] = useState(''); // State to store validation errors
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the form data
    setFormData({ ...formData, [name]: value });

    // Validate password if the input is for the password field
    if (name === 'password') {
      if (value.length < 6) {
        setError('Password must be at least 6 characters long.');
      } else if (!/\d/.test(value)) {
        setError('Password must contain at least one number.');
      } else {
        setError(''); // Clear error if validation passes
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error) {
      alert('Please fix the errors before submitting the form.');
      return;
    }

    try {
      console.log('Sending registration data:', formData);

      const response = await fetch('http://localhost:5001/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          address: formData.address,
        }),
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      alert('Registration successful!');
      navigate('/customer-dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
      alert(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <NavbarHome />
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p style={{ color: 'red', fontSize: '0.9em' }}>{error}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={!!error}>
          Sign Up
        </button>
      </form>
      <div className="login-link">
        Already have an account? <span><Link to="/">Login</Link></span>
      </div>
    </div>
  );
};

export default Signup;
