USE Courier_service;

DROP PROCEDURE IF EXISTS GetOrderStatus;

DELIMITER //

CREATE PROCEDURE GetOrderStatus(IN oid INT)

BEGIN
    SELECT * FROM `Order` WHERE OrderID = oid;
END //

DELIMITER ;