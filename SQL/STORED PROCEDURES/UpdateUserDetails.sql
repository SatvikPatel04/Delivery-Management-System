USE Courier_service;

DROP PROCEDURE IF EXISTS GetUserOrders;

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