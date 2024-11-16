require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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
    process.exit(1); 
  }
}
connectToDatabase();

let globalUID = 0; 


// Endpoint to Place Order
app.post('/place-order', async (req, res) => {
  try {
    const { pickUpLocation, dropOffLocation, distance } = req.body;

    if (!pickUpLocation || !dropOffLocation  || !distance) {
        const missingFields = {
          pickUpLocation: !pickUpLocation,
          dropOffLocation: !dropOffLocation,
          distance: !distance
        };
        
        console.log('Missing fields:', missingFields);
        
        return res.status(400).json({ 
          message: 'Missing required fields', 
          missingFields 
        });
      }

    const cost = distance * 2;

    // Call the stored procedure
    await db.query(`CALL PlaceOrder(?, ?, ?, ?)`, [pickUpLocation, dropOffLocation, globalUID, cost]);
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

    globalUID = result[0].UserID;
    res.status(200).json({ message: 'User registered successfully', UserID: globalUID });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});


// Endpoint to Login
app.post('/authenticate-user', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    // Call the stored procedure
    const [results] = await db.query('CALL AuthenticateUser(?, ?, ?)', [email, password, role]);
    const user = results[0][0];

    if (!user) {
      // If no user is found, return an appropriate error message
      return res.status(401).json({ message: 'Invalid email, password, or role' });
    }

    // User is authenticated successfully
    globalUID = user.UserID;
    res.status(200).json({
      message: 'Login successful',
      user: { id: user.UserID, name: user.Name, email: user.Email },
    });
  } catch (error) {
    // Log error and return a generic server error message
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Endpoint to Track Order
app.get('/order-status', async (req, res) => {
  const { orderId } = req.query;

  try {
    const [results] = await db.query('CALL GetOrderStatus(?)', [orderId]);
    const orderData = results[0][0];

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
    const [results] = await db.query('CALL GetUserOrders(?)', [globalUID]);
    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
  }
});


// Endpoint to log out
app.post('/logout', (req, res) => {
  globalUID = 0;
  res.status(200).send({ message: 'Logged out successfully' });
});


// Endpoint to Update User Details
app.post('/update-user-details', async (req, res) => {
  try {
    const { name, email, phoneNumber, password, address } = req.body;

    // Validate request body
    if ( !name || !email || !phoneNumber || !password || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Call the stored procedure
    await db.query(`CALL UpdateUserDetails(?, ?, ?, ?, ?, ?)`, [
      globalUID,
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
      // User not found error from the stored procedure
      res.status(404).json({ message: 'UserID not found' });
    } else {
      // Other database errors
      res.status(500).json({ message: 'Database error', error: error.message });
    }
  }
});


// Start server at port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
