import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Correct import here
import './Signup.css';

function Test() {
  const [role, setRole] = useState('customer');

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <div className="signup-container">
      <h2>Login</h2>
      <form className="signup-form">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" required />

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

        <button type="submit">Login</button>
      </form>
      {/* <div className="login-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div> */}
    </div>
  );
}

export default Test;

// .dashboard-container {
//   width: 90%;
//   margin: 0 auto;
//   padding: 20px;
//   text-align: center;
// }

// h2 {
//   margin-bottom: 20px;
//   font-size: 1.5em;
// }

// .customer-table {
//   width: 100%;
//   border-collapse: collapse;
// }

// .customer-table th,
// .customer-table td {
//   padding: 12px;
//   text-align: center;
//   border: 1px solid #000000bb;
// }

// .customer-table th {
//   background-color: #000000;
//   font-weight: bold;
// }

// .customer-table tr:nth-child(even) {
//   background-color: #000000bb;
// }

// .customer-table tr:nth-child(odd) {
//   background-color: #000000cf;
// }

// .customer-table tr:hover {
//   background-color: #4e4e4ebb;
// }

// .customer-table td {
//   font-size: 0.9em;
// }
