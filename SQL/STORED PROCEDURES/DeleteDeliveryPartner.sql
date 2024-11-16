USE Courier_service;

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
