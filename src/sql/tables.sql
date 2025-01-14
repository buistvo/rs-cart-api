create table cart(
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    status VARCHAR(10) CHECK (status IN ('OPEN', 'ORDERED'))
)

create table cart_item(
    id UUID PRIMARY KEY,
	cart_id UUID REFERENCES carts(id),
	product_id UUID, 
	count INT
)