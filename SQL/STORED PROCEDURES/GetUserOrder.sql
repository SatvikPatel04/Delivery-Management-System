USE Courier_service;

DROP PROCEDURE IF EXISTS GetUserOrders;

DELIMITER //

CREATE PROCEDURE GetUserOrders(IN user_id INT)
BEGIN
    SELECT 
        o.OrderID,
        dp.Name AS DeliveryPartnerName,
        o.Amount,
        o.OrderStatus,
        o.OrderTime
    FROM 
        `Order` o
    LEFT JOIN 
        Delivery_partner dp ON o.Delivery_partnerID = dp.Delivery_partnerID
    WHERE 
        o.UserID = user_id;
END //

DELIMITER ;
