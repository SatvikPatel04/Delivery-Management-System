-- Create the database and use it
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

-- Orders table (renamed from Order)
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