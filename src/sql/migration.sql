-- Insert test data into the "carts" table
INSERT INTO carts (id, user_id, created_at, updated_at, status)
VALUES
    ('1c6c5429-8e9e-41ea-b722-5aa0091cb9a1', '5d27e3e9-5d22-4a57-8d41-42d7299f62ce', '2023-11-01', '2023-11-01', 'OPEN'),
    ('f9e1e4b9-15e7-4c7c-a074-4a9810e48ed6', 'b7f1db2d-1a63-4fcf-b132-51ff994f864e', '2023-11-02', '2023-11-02', 'ORDERED'),
    ('db1a8123-fc21-454c-9d47-7c6d98ff39db', 'a31f65dd-570a-4e7f-990a-6d28c3bace50', '2023-11-03', '2023-11-03', 'OPEN');

-- Insert test data into the "cart_items" table
INSERT INTO cart_items (cart_id, product_id, count)
VALUES
    ('1c6c5429-8e9e-41ea-b722-5aa0091cb9a1', '4eb39c9b-1c25-4c3d-9b2e-817fd3d31dbf', 3),
    ('1c6c5429-8e9e-41ea-b722-5aa0091cb9a1', 'b267e4af-06c5-481a-b30c-6a60727b5017', 2),
    ('f9e1e4b9-15e7-4c7c-a074-4a9810e48ed6', '2c6d14e0-21f0-4e3c-9c76-4b34b9cd6962', 1),
    ('db1a8123-fc21-454c-9d47-7c6d98ff39db', 'a13c7a38-3a3f-4d95-aee3-f1c14ef3190e', 5);