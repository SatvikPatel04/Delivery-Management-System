USE Courier_service;

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