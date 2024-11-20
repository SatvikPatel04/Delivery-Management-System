USE Courier_service;

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




-- Trigger that updates delivery partner status with order status
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