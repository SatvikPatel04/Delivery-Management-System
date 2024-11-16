USE Courier_service;

DROP PROCEDURE IF EXISTS GetUserOrders;

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