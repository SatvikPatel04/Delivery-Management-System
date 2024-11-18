USE Courier_service;

DROP PROCEDURE IF EXISTS GetAllOrders;

DELIMITER //

CREATE PROCEDURE GetAllOrders()
BEGIN
    SELECT 
        o.OrderID,
        o.UserID,
        dp.Name AS DeliveryPartnerName,
        o.Amount,
        o.OrderStatus,
        o.OrderTime
    FROM 
        `Order` o
    LEFT JOIN 
        Delivery_partner dp ON o.Delivery_partnerID = dp.Delivery_partnerID
    ORDER BY 
        o.UserID;
END //

DELIMITER ;
