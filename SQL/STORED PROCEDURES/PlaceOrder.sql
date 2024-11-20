USE Courier_service;

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