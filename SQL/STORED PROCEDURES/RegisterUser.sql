USE Courier_service;

DROP PROCEDURE IF EXISTS GetUserOrders;

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