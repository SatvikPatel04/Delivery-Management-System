require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await support
const cors = require('cors');
const session = require('express-session');

const app = express();
app.use(
    cors({
      origin: 'http://localhost:5173', // Replace with your frontend URL
      credentials: true, // Allow cookies to be sent
    })
  );
  
app.use(express.json());
app.use(
  session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 600000 }, // Use `secure: true` in production
  })
);

// Connect to MySQL database using promise-based syntax
let db;

async function connectToDatabase() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('Connected to MySQL database'); // Confirmation message
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the application if connection fails
  }
}

// Call the connect function
connectToDatabase();

let globalUID = 1;

// Endpoint to Place Order
app.post('/place-order', async (req, res) => {
    try {
      const { pickUpLocation, dropOffLocation, distance } = req.body;
  
      if (!pickUpLocation || !dropOffLocation || !distance) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      if (!req.session.userID) {
        return res.status(401).json({ message: 'Unauthorized: Please log in.' });
      }
  
      const cost = distance * 2;
  
      await db.query(`CALL PlaceOrder(?, ?, ?, ?)`, [
        pickUpLocation,
        dropOffLocation,
        req.session.userID,
        cost,
      ]);
  
      res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Database error', error: error.message });
    }
  });
  

// API endpoint to remove a delivery partner
app.delete('/remove-dp', async (req, res) => {
  const { partnerID } = req.body;

  if (!partnerID) {
    return res.status(400).json({ message: 'Delivery partner ID is required.' });
  }

  const query = `CALL DeleteDeliveryPartner(?)`;

  try {
    await db.query(query, [partnerID]);
    res.status(200).json({ message: 'Delivery partner removed successfully.' });
  } catch (error) {
    console.error('Error removing delivery partner:', error);
    res.status(500).json({ message: 'Failed to remove delivery partner.', error });
  }
});

// Endpoint to Register User
app.post('/register-user', async (req, res) => {
    try {
      const { name, email, phoneNumber, password, address } = req.body;
  
      if (!name || !email || !phoneNumber || !password || !address) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      await db.query(`CALL RegisterUser(?, ?, ?, ?, ?, @newUserID)`, [name, email, phoneNumber, password, address]);
      const [result] = await db.query('SELECT @newUserID AS UserID');
  
      req.session.userID = result[0].UserID; // Automatically log in the user after registration
      res.status(200).json({ message: 'User registered successfully', UserID: req.session.userID });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Database error', error: error.message });
    }
  });

// Endpoint to Authenticate User
// Endpoint to Authenticate User
app.post('/authenticate-user', async (req, res) => {
    try {
      const { email, password, role } = req.body;
  
      if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required' });
      }
  
      const [results] = await db.query('CALL AuthenticateUser(?, ?, ?)', [email, password, role]);
      console.log("Results from AuthenticateUser:", results);
  
      const user = results[0][0]; // Extract the user from the nested array
      console.log("Extracted user data:", user);
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email, password, or role' });
      }
  
      req.session.userID = user.UserID; // Correctly set the session
      console.log("Session data after login:", req.session);
  
      res.status(200).json({
        message: 'Login successful',
        user: { id: user.UserID, name: user.Name, email: user.Email },
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  
  
  


// Endpoint to Track Order
app.get('/order-status', async (req, res) => {
  const { orderId } = req.query;

  try {
    const [results] = await db.query('CALL GetOrderStatus(?)', [orderId]);
    const orderData = results[0];

    if (!orderData) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      orderNumber: orderId,
      totalAmount: orderData.Amount,
      currentStatus: orderData.OrderStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve order status', error: error.message });
  }
});

// Endpoint to View Delivery Partners
app.get('/delivery-partners', async (req, res) => {
  try {
    const [results] = await db.query('CALL GetDeliveryPartnerDetails()');
    console.log("Fetched Delivery Partners:", results);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve delivery partner details', error: error.message });
  }
});

// Endpoint to Add Delivery Partner
app.post('/add-delivery-partner', async (req, res) => {
  const { name, phoneNumber, vehicleType, vehicleCapacity, maintenanceSchedule } = req.body;

  if (!name || !phoneNumber || !vehicleType || !vehicleCapacity || !maintenanceSchedule) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await db.query(`CALL ManageDelivery_partners('Add', NULL, ?, 'Available', ?, ?, ?, ?, NULL)`, [
      name,
      phoneNumber,
      vehicleType,
      vehicleCapacity,
      maintenanceSchedule,
    ]);
    res.status(200).json({ message: 'Delivery partner added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// Endpoint to get orders for a specific user ID
app.get('/view-orders', async (req, res) => {
    try {
      const [results] = await db.query('CALL GetUserOrders(?)', [req.session.userID]);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
    }
  });

// Endpoint to log out
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error logging out:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
  



// Endpoint to Update User Details
app.post('/update-user-details', async (req, res) => {
    try {
      const { name, email, phoneNumber, password, address } = req.body;
  
      if (!name || !email || !phoneNumber || !password || !address) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      await db.query(`CALL UpdateUserDetails(?, ?, ?, ?, ?, ?)`, [
        req.session.userID,
        name,
        email,
        phoneNumber,
        password,
        address,
      ]);
  
      res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
      console.error('Error updating user details:', error);
  
      if (error.sqlState === '45000') {
        res.status(404).json({ message: 'UserID not found' });
      } else {
        res.status(500).json({ message: 'Database error', error: error.message });
      }
    }
  });





// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
