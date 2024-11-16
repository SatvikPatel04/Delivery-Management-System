require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});


var globalUID = 1;

//1)
// Endpoint to Place Order
app.post('/place-order', (req, res) => {
  try {
    console.log('1. Request received:', req.body);
    
    const { pickUpLocation, dropOffLocation, userID, distance } = req.body;
    
    // Validate all required fields
    if (!pickUpLocation || !dropOffLocation || !userID || !distance) {
      const missingFields = {
        pickUpLocation: !pickUpLocation,
        dropOffLocation: !dropOffLocation,
        userID: !userID,
        distance: !distance
      };
      
      console.log('Missing fields:', missingFields);
      
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missingFields 
      });
    }
    var cost = distance*2;
    // Call the stored procedure
    db.query(
      `CALL PlaceOrder(?, ?, ?, ?)`, 
      [pickUpLocation, dropOffLocation, globalUID, cost], 
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            message: 'Database error', 
            error: err.message 
          });
        }
        
        console.log('Order placed successfully:', results);
        res.status(200).json({ 
          message: 'Order placed successfully', 
          results 
        });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      message: 'Server error',  
      error: error.message 
    });
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
      // Execute the stored procedure with the provided partnerID
      await db.query(query, [partnerID]);
      res.status(200).json({ message: 'Delivery partner removed successfully.' });
  } catch (error) {
      console.error('Error removing delivery partner:', error);
      res.status(500).json({ message: 'Failed to remove delivery partner.', error });
  }
});






//2) 
// Endpoint to Register User
// Endpoint to Register User
app.post('/register-user', (req, res) => {
  try {
    console.log('1. Request received:', req.body);

    const { name, email, phoneNumber, password, address } = req.body;

    if (!name || !email || !phoneNumber || !password || !address) {
      const missingFields = {
        name: !name,
        email: !email,
        phoneNumber: !phoneNumber,
        password: !password,
        address: !address,
      };

      console.log('Missing fields:', missingFields);

      return res.status(400).json({
        message: 'Missing required fields',
        missingFields,
      });
    }

    // Call the RegisterUser stored procedure and store the new UserID in globalUID
    db.query(
      `CALL RegisterUser(?, ?, ?, ?, ?, @newUserID)`,
      [name, email, phoneNumber, password, address],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            message: 'Database error',
            error: err.message,
          });
        }

        // Fetch the new UserID
        db.query('SELECT @newUserID AS UserID', (err, result) => {
          if (err) {
            console.error('Error retrieving UserID:', err);
            return res.status(500).json({
              message: 'Error retrieving UserID',
              error: err.message,
            });
          }

          // Set globalUID to the new UserID
          globalUID = result[0].UserID;
          console.log('User registered successfully with UserID:', globalUID);
          res.status(200).json({
            message: 'User registered successfully',
            UserID: globalUID,
          });
        });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});





// Login!!

// Keep all your existing imports and middleware
// Keep your existing place-order and register-user endpoints

app.post('/authenticate-user', (req, res) => {
  try {
    console.log('1. Login request received:', req.body);

    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Email, password, and role are required' 
      });
    }

    console.log('2. Authenticating user:', email, 'Role:', role);

    // Call the stored procedure with role
    db.query(
      'CALL AuthenticateUser(?, ?, ?)', 
      [email, password, role], 
      (err, results) => {
        if (err) {
          console.error('3. Database error:', err);
          return res.status(500).json({ 
            message: 'Login failed', 
            error: err.message 
          });
        }

        console.log('3. Database results:', results);

        // Check if we got any results
        const user = results[0][0];
        if (!user) {
          console.log('4. Invalid credentials or role');
          return res.status(401).json({ 
            message: 'Invalid email, password, or role' 
          });
        }

        console.log('4. User authenticated:', user.Email);
        globalUID = user.UserID
        res.status(200).json({ 
          message: 'Login successful',
          user: {
            id: user.UserID,
            name: user.Name,
            email: user.Email,
          }
        });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});











// Endpoint to Process Payment
app.post('/process-payment', (req, res) => {
  const { orderId, paymentAmount, paymentMethod } = req.body;

  // Call the ProcessPayment procedure
  db.query(`CALL ProcessPayment(?, ?, ?)`, [orderId, paymentAmount, paymentMethod], (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.status(200).json({ message: 'Payment processed successfully', results });
  });
});

// Add this test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 as result', (err, results) => {
    if (err) {
      console.error('Database test failed:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
    res.json({ message: 'Database connection successful', results });
  });
});





//Endpoint to TrackOrder
app.get('/order-status', (req, res) => {
  const { orderId } = req.query; 

  console.log("Fetching status for OrderID:", orderId);  // Log orderId

  db.query('CALL GetOrderStatus(?)', [orderId], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: 'Failed to retrieve order status' });
      return;
    }

    console.log("Database results:", results);  // Log the full results object

    // Check if results are empty or properly structured
    if (results[0].length === 0) {
      res.status(404).json({ error: 'Order not found' });
    } else {
      res.json({
        orderNumber: orderId,
        totalAmount: results[0][0].Amount,
        currentStatus: results[0][0].OrderStatus
      });
    }
  });
});


//Endpoint to ViewDeliveryPartners
app.get('/delivery-partners', (req, res) => {
  db.query("CALL GetDeliveryPartnerDetails()", (err, results) => {
    if (err) {
      console.error("Error fetching delivery partner details:", err);
      return res.status(500).json({ error: "An error occurred while fetching data." });
    }

    // Log the result to ensure Delivery_partnerID is being returned
    console.log("Delivery Partner Data:", results[0]);

    res.json(results[0]);
  });
});




//Endpoint for AddDeliveryPartner
app.post('/add-delivery-partner', (req, res) => {
  try {
    const { name, phoneNumber, vehicleType, vehicleCapacity, maintenanceSchedule } = req.body;

    // Validate required fields
    if (!name || !phoneNumber || !vehicleType || !vehicleCapacity || !maintenanceSchedule) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    // Call the ManageDelivery_partners stored procedure
    db.query(
      `CALL ManageDelivery_partners('Add', NULL, ?, 'Available', ?, ?, ?, ?, NULL)`,
      [name, phoneNumber, vehicleType, vehicleCapacity, maintenanceSchedule],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            message: 'Database error',
            error: err.message,
          });
        }

        console.log('Delivery partner added successfully:', results);
        res.status(200).json({
          message: 'Delivery partner added successfully',
          results,
        });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});




// Endpoint to get orders for a specific user ID
app.get('/view-orders', (req, res) => {
  const query = "CALL GetUserOrders(?)"; // Assuming `GetUserOrders` stored procedure is created
  
  db.query(query, 
    [globalUID], 
    (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "An error occurred while fetching orders." });
    }

    // Log to check data structure
    console.log("Orders Data:", results[0]);
    res.json(results[0]);
  });
});




//Endpoint of Logout
app.post('/logout', (req, res) => {
  globalUID = -1; // Set globalUID to -1 on logout
  res.status(200).send({ message: 'Logged out successfully' });
});





// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
