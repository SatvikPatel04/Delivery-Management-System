import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import NavbarHome from '../../Components/Navbar/NavbarHome';

function Login1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { ...formData, role });

      const response = await fetch('http://localhost:5001/authenticate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Invalid email or password.');
      }

      // Store user data in localStorage
      localStorage.setItem('userID', data.user.id);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userRole', role);

      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/customer-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          value={formData.email}
          onChange={handleChange}
          required 
        />

        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          value={formData.password}
          onChange={handleChange}
          required 
        />

        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="customer"
              checked={role === 'customer'}
              onChange={handleRoleChange}
            />
            Customer
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={handleRoleChange}
            />
            Admin
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="signup-link">
        Don't have an account? <span><Link to="/signup">Sign up</Link></span>
      </div>
    </div>
  );
}

function Login() {
  return(
    <div>
      <NavbarHome />
      <Login1 />
    </div>
  );
}

export default Login;