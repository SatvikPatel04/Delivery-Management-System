USE Courier_service;

DELIMITER //

-- Stored Procedure to authenticate user credentials with role verification
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

