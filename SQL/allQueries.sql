-- Create and use database 
CREATE DATABASE Courier_Service;
USE Courier_Service;

-- User table 
CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(15),
    Password VARCHAR(100) NOT NULL,
    Address TEXT
);

-- Vehicle table 
CREATE TABLE Vehicle (
    VehicleID INT PRIMARY KEY AUTO_INCREMENT,
    Type VARCHAR(50) NOT NULL,
    Capacity DECIMAL(10, 2),
    MaintenanceSchedule DATE,
    GPSLocation VARCHAR(100)
);

-- Delivery_partner table 
CREATE TABLE Delivery_partner (
    Delivery_partnerID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Status ENUM('Available', 'Unavailable') DEFAULT 'Available',
    PhoneNumber VARCHAR(15) UNIQUE,
    VehicleID INT,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID)
);

-- `Order` table 
CREATE TABLE `Order` (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    PickUpLocation VARCHAR(255) NOT NULL,
    DropOffLocation VARCHAR(255) NOT NULL,
    Amount INT NOT NULL,
    OrderStatus ENUM('Pending', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    OrderTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    DeliveryTime DATETIME,
    UserID INT NOT NULL,
    Delivery_partnerID INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (Delivery_partnerID) REFERENCES Delivery_partner(Delivery_partnerID)
);

-- Admin table
CREATE TABLE Admin (
    AdminID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Role ENUM('SuperAdmin', 'Manager', 'Support') DEFAULT 'Support',
    Password VARCHAR(100) NOT NULL
);

-- Table to store deleted delivery partners
CREATE TABLE deleted_Delivery_partner (
    Delivery_partnerID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL,
    VehicleID INT NOT NULL
);

-- AuditLog table for logging activities
CREATE TABLE AuditLog (
    LogID INT PRIMARY KEY AUTO_INCREMENT,
    Activity VARCHAR(255),
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);




-- Stored Procedure to authenticate user credentials with role verification
DROP PROCEDURE IF EXISTS AuthenticateUser;
DELIMITER //

CREATE PROCEDURE AuthenticateUser(
    IN userEmail VARCHAR(100),
    IN userPassword VARCHAR(100),
    IN userRole VARCHAR(20)
)
BEGIN
    DECLARE userCount INT;

    -- Check if email and password match in the respective table based on the role
    IF userRole = 'customer' THEN
        SELECT COUNT(*) INTO userCount 
        FROM User 
        WHERE Email = userEmail AND Password = userPassword;

        IF userCount = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email or password for customer.';
        ELSE
            SELECT UserID, Name, Email, PhoneNumber, Address 
            FROM User 
            WHERE Email = userEmail AND Password = userPassword;
        END IF;

    ELSEIF userRole = 'admin' THEN
        -- Check if the role matches one of the valid admin roles
        SELECT COUNT(*) INTO userCount 
        FROM Admin 
        WHERE Email = userEmail AND Password = userPassword;

        IF userCount = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email, password, or role for admin.';
        ELSE
            SELECT AdminID AS UserID, Name, Email, Role 
            FROM Admin 
            WHERE Email = userEmail AND Password = userPassword;
        END IF;

    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid role specified.';
    END IF;
END //

DELIMITER ;




-- Procedure to delete delivery partner and store their information in deleted_Delivery_partner table
DROP PROCEDURE IF EXISTS DeleteDeliveryPartner;
DELIMITER //

CREATE PROCEDURE DeleteDeliveryPartner(IN partnerID INT)
BEGIN
    DECLARE partnerName VARCHAR(100);
    DECLARE partnerPhone VARCHAR(15);
    DECLARE vid INT;

    -- Retrieve partner details before deleting
    SELECT Name, PhoneNumber, VehicleID INTO partnerName, partnerPhone, vid
    FROM Delivery_partner
    WHERE Delivery_partnerID = partnerID;

    -- Ensure we insert only if partner details were found
    IF partnerName IS NOT NULL THEN
        -- Insert partner details into deleted_Delivery_partner
        INSERT INTO deleted_Delivery_partner VALUES (partnerID, partnerName, partnerPhone, vid);

        -- Delete the delivery partner
        DELETE FROM Delivery_partner
        WHERE Delivery_partnerID = partnerID;

        -- Delete the associated vehicle if no other partner is using it and if vid is not NULL
        IF vid IS NOT NULL THEN
            DELETE FROM Vehicle
            WHERE VehicleID = vid AND vid NOT IN (SELECT VehicleID FROM Delivery_partner);
        END IF;
    END IF;

END //

DELIMITER ;



-- Procedure to retrieve information of all orders (for Admin)
DROP PROCEDURE IF EXISTS GetAllOrders;
DELIMITER //

CREATE PROCEDURE GetAllOrders()
BEGIN
    SELECT 
        o.OrderID,
        o.UserID,
        dp.Name AS DeliveryPartnerName,
        o.Amount,
        o.OrderStatus,
        o.OrderTime
    FROM 
        `Order` o
    LEFT JOIN 
        Delivery_partner dp ON o.Delivery_partnerID = dp.Delivery_partnerID
    ORDER BY 
        o.UserID;
END //

DELIMITER ;




-- Procedure to retrieve information all delivery partners (for admin)
DROP PROCEDURE IF EXISTS GetDeliveryPartnerDetails;
DELIMITER //

CREATE PROCEDURE GetDeliveryPartnerDetails()

BEGIN
    SELECT 
        dp.Delivery_partnerID, 
        dp.Name, 
        dp.Status, 
        dp.PhoneNumber, 
        dp.VehicleID,
        v.Type AS VehicleType, 
        v.Capacity AS VehicleCapacity, 
        v.MaintenanceSchedule
    FROM 
        Delivery_partner dp
    LEFT JOIN 
        vehicle v ON dp.VehicleID = v.VehicleID;
END //

DELIMITER ;




-- Procedure to get order status using orderID
DROP PROCEDURE IF EXISTS GetOrderStatus;
DELIMITER //

CREATE PROCEDURE GetOrderStatus(IN oid INT)

BEGIN
    SELECT * FROM `Order` WHERE OrderID = oid;
END //

DELIMITER ;





-- Procedure to get order history of user given user_id
DROP PROCEDURE IF EXISTS GetUserOrders;
DELIMITER //

CREATE PROCEDURE GetUserOrders(IN user_id INT)
BEGIN
    SELECT 
        o.OrderID,
        dp.Name AS DeliveryPartnerName,
        o.Amount,
        o.OrderStatus,
        o.OrderTime
    FROM 
        `Order` o
    LEFT JOIN 
        Delivery_partner dp ON o.Delivery_partnerID = dp.Delivery_partnerID
    WHERE 
        o.UserID = user_id;
END //

DELIMITER ;





-- Procedure to add a new delivery partner
DROP PROCEDURE IF EXISTS ManageDelivery_partners;
DELIMITER //

CREATE PROCEDURE ManageDelivery_partners(
    IN actionType VARCHAR(10),
    IN Delivery_partnerId INT,
    IN Delivery_partnerName VARCHAR(100),
    IN Delivery_partnerStatus ENUM('Available', 'Unavailable'),
    IN Delivery_partnerPhone VARCHAR(15),
    IN vehicleType VARCHAR(50),
    IN vehicleCapacity DECIMAL(10, 2),
    IN maintenanceSchedule DATE,
    IN gpsLocation VARCHAR(100)
)
BEGIN
    DECLARE newVehicleID INT;

    IF actionType = 'Add' THEN
        -- Insert the vehicle details into the Vehicle table
        INSERT INTO Vehicle (Type, Capacity, MaintenanceSchedule, GPSLocation)
        VALUES (vehicleType, vehicleCapacity, maintenanceSchedule, gpsLocation);

        -- Retrieve the last inserted VehicleID
        SET newVehicleID = LAST_INSERT_ID();

        -- Insert the delivery partner details with the new VehicleID
        INSERT INTO Delivery_partner (Name, Status, PhoneNumber, VehicleID)
        VALUES (Delivery_partnerName, Delivery_partnerStatus, Delivery_partnerPhone, newVehicleID);

    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid action type provided.';
    END IF;
END //

DELIMITER ;




-- Procedure to place an order
DROP PROCEDURE IF EXISTS PlaceOrder;
DELIMITER //

CREATE PROCEDURE PlaceOrder(
    IN pickUpLocation VARCHAR(255),
    IN dropOffLocation VARCHAR(255),
    IN userID INT,
    IN totalAmount DECIMAL(10, 2) -- Pass totalAmount as an argument
)
BEGIN
    DECLARE assignedDelivery_partner INT;

    -- Find the first available Delivery_partner
    SELECT Delivery_partnerID INTO assignedDelivery_partner FROM Delivery_partner WHERE Status = 'Available' LIMIT 1;

    IF assignedDelivery_partner IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No available Delivery_partners at the moment.';
    ELSE
        -- Insert the new order with the assigned Delivery_partner and total amount
        INSERT INTO `Order` (PickUpLocation, DropOffLocation, UserID, Delivery_partnerID, OrderStatus, Amount)
        VALUES (pickUpLocation, dropOffLocation, userID, assignedDelivery_partner, 'Pending', totalAmount);

        -- Update the Delivery_partner’s status to Unavailable
        UPDATE Delivery_partner SET Status = 'Unavailable' WHERE Delivery_partnerID = assignedDelivery_partner;
    END IF;
END //

DELIMITER ;




-- Procedure to signup a new user
DROP PROCEDURE IF EXISTS RegisterUser;
DELIMITER //

CREATE PROCEDURE RegisterUser(
    IN userName VARCHAR(100),
    IN userEmail VARCHAR(100),
    IN userPhone VARCHAR(15),
    IN userPassword VARCHAR(100),
    IN userAddress TEXT,
    OUT newUserID INT
)
BEGIN
    DECLARE existingUser INT;

    -- Check if the email already exists
    SELECT COUNT(*) INTO existingUser FROM User WHERE Email = userEmail;

    -- If the email exists, signal an error
    IF existingUser > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already exists.';
    ELSE
        -- Insert new user
        INSERT INTO User (Name, Email, PhoneNumber, Password, Address)
        VALUES (userName, userEmail, userPhone, userPassword, userAddress);
        
        -- Get the UserID of the newly inserted user
        SET newUserID = LAST_INSERT_ID();
    END IF;
END //

DELIMITER ;





-- Procedure to Update user information
DROP PROCEDURE IF EXISTS UpdateUserDetails;

DELIMITER //

CREATE PROCEDURE UpdateUserDetails(
    IN p_UserID INT,
    IN p_Name VARCHAR(255),
    IN p_newEmail VARCHAR(255),
    IN p_newPhoneNumber VARCHAR(15),
    IN p_newPassword VARCHAR(255),
    IN p_newAddress TEXT
)
BEGIN
    -- Check if the user exists
    IF EXISTS (SELECT 1 FROM User WHERE UserID = p_UserID) THEN
        -- Update the user details
        UPDATE User
        SET 
            Email = p_newEmail,
            Name = p_Name,
            PhoneNumber = p_newPhoneNumber,
            Password = p_newPassword,
            Address = p_newAddress
        WHERE 
            UserID = p_UserID;
    ELSE
        -- Handle case where user does not exist (optional)
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'UserID not found.';
    END IF;
END //

DELIMITER ;


-- Trigger to update delivery partner status with order status
DROP TRIGGER IF EXISTS trg_update_Delivery_partner_status;
DELIMITER //

CREATE TRIGGER trg_update_Delivery_partner_status
AFTER UPDATE ON `order`
FOR EACH ROW
BEGIN
    IF NEW.OrderStatus = 'In Transit' THEN
        UPDATE Delivery_partner 
        SET Status = 'Unavailable' 
        WHERE Delivery_partnerID = NEW.Delivery_partnerID;
    ELSEIF NEW.OrderStatus = 'Delivered' THEN
        UPDATE Delivery_partner 
        SET Status = 'Available' 
        WHERE Delivery_partnerID = NEW.Delivery_partnerID;
    END IF;
END //

DELIMITER ;