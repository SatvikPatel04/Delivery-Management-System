USE Courier_service;

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