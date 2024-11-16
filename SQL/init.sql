USE Courier_service;

-- Creating an Admin
INSERT INTO Admin (Name, Email, Role, Password) VALUES ('Admin1', 'admin1@example.com', 'SuperAdmin', 'admin123');

-- Adding initial 5 delivery partners
CALL ManageDelivery_partners(
    'Add', 
    NULL, 
    'John Doe', 
    'Available', 
    '9876543210', 
    'Petroleum', 
    2.00, 
    '2025-05-01', 
    NULL
);

CALL ManageDelivery_partners(
    'Add', 
    NULL, 
    'Jane Smith', 
    'Unavailable', 
    '8765432109', 
    'CNG', 
    4.00, 
    '2025-05-15', 
    NULL
);

CALL ManageDelivery_partners(
    'Add', 
    NULL, 
    'Mike Johnson', 
    'Available', 
    '7654321098', 
    'Electric', 
    4.00, 
    '2025-04-05', 
    NULL
);

CALL ManageDelivery_partners(
    'Add', 
    NULL, 
    'Emily Davis', 
    'Unavailable', 
    '6543210987', 
    'Electric', 
    2.00, 
    '2025-01-20', 
    NULL
);

CALL ManageDelivery_partners(
    'Add', 
    NULL, 
    'Chris Brown', 
    'Available', 
    '5432109876', 
    'Petroleum', 
    200.00, 
    '2025-02-10', 
    NULL
);
